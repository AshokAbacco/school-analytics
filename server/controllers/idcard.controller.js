// server/controllers/idcard.controller.js
import prisma from "../config/prismaClient.js";

// ── Parse the JSON envelope stored in template.description ───────────────────
// cardBlocks + elementLayout are stored there (no schema migration needed)
const parseTemplateLayout = (t) => {
  if (!t) return t;
  try {
    const parsed = t.description ? JSON.parse(t.description) : null;
    if (parsed && parsed.__meta) {
      return {
        ...t,
        description:   parsed.text          || null,
        cardBlocks:    parsed.cardBlocks     || null,
        elementLayout: parsed.elementLayout  || null,
      };
    }
  } catch {}
  return { ...t, cardBlocks: null, elementLayout: null };
};



// ── GET ALL ORDERS ─────────────────────────────────────────────────────────────
// GET /api/id-cards/orders
// Query params: ?status= ?schoolId= ?page=1 ?limit=20
export const getAllOrders = async (req, res) => {
  try {
    const { status, schoolId, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (status)   where.status   = status;
    if (schoolId) where.schoolId = schoolId;

    const [orders, total] = await Promise.all([
      prisma.idCardOrder.findMany({
        where,
        orderBy: { orderedAt: "desc" },
        skip,
        take: Number(limit),
        include: {
          school: {
            select: {
              id:    true,
              name:  true,
              city:  true,
              state: true,
              phone: true,
              email: true,
              type:  true,
            },
          },
          template: {
            select: {
              id:           true,
              title:        true,
              description:  true,   // ← JSON envelope holds cardBlocks + elementLayout
              templateType: true,
              templateKey:  true,
              primaryColor: true,
              accentColor:  true,
              imageUrl:     true,
            },
          },
        },
      }),
      prisma.idCardOrder.count({ where }),
    ]);

    // Parse cardBlocks + elementLayout out of the description JSON envelope
    const parsedOrders = orders.map((o) => ({
      ...o,
      template: parseTemplateLayout(o.template),
    }));

    return res.json({
      success: true,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      orders:     parsedOrders,
    });
  } catch (err) {
    console.error("getAllOrders error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// ── GET SINGLE ORDER WITH STUDENTS ────────────────────────────────────────────
// GET /api/id-cards/orders/:id
// Returns order details + fetches actual students from the classes in classDetails
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.idCardOrder.findUnique({
      where: { id },
      include: {
        school: {
          select: {
            id:    true,
            name:  true,
            city:  true,
            state: true,
            phone: true,
            email: true,
            type:  true,
          },
        },
        template: {
          select: {
            id:           true,
            title:        true,
            description:  true,   // ← JSON envelope holds cardBlocks + elementLayout
            templateType: true,
            templateKey:  true,
            primaryColor: true,
            accentColor:  true,
            imageUrl:     true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Fetch students from the classes listed in this order
    const classDetails = Array.isArray(order.classDetails) ? order.classDetails : [];

    // Get class names from the order
    const classNames = classDetails.map((c) => c.className).filter(Boolean);

    // Fetch all class sections for this school — use flexible matching
    // because the order stores short names like "1-A" but DB may have "Grade 1 - A" etc.
    const allClassSections = await prisma.classSection.findMany({
      where: { schoolId: order.schoolId },
      select: { id: true, name: true },
    });

    // Match: exact first, then case-insensitive contains in either direction
    const classSections = allClassSections.filter((cs) =>
      classNames.some((cn) => {
        const a = cn.trim().toLowerCase();
        const b = cs.name.trim().toLowerCase();
        return (
          a === b ||                          // exact
          b.includes(a) ||                    // DB name contains order name
          a.includes(b) ||                    // order name contains DB name
          a.replace(/\s/g,"") === b.replace(/\s/g,"")  // ignore spaces
        );
      })
    );

    // Build reverse map: classSection.id → the order className it matched
    const sectionToOrderClass = {};
    classSections.forEach((cs) => {
      const matched = classNames.find((cn) => {
        const a = cn.trim().toLowerCase();
        const b = cs.name.trim().toLowerCase();
        return a === b || b.includes(a) || a.includes(b) || a.replace(/\s/g,"") === b.replace(/\s/g,"");
      });
      if (matched) sectionToOrderClass[cs.id] = matched;
    });

    const classSectionIds = classSections.map((cs) => cs.id);

    // Fetch students enrolled in these classes
    let students = [];
    if (classSectionIds.length > 0) {
      const enrollments = await prisma.studentEnrollment.findMany({
        where: {
          classSectionId: { in: classSectionIds },
          status:         "ACTIVE",
        },
        include: {
          student: {
            select: {
              id:    true,
              email: true,
              personalInfo: {
                select: {
                  firstName:    true,
                  lastName:     true,
                  phone:        true,
                  bloodGroup:   true,
                  profileImage: true,
                  parentName:   true,
                  parentPhone:  true,
                },
              },
            },
          },
          classSection: {
            select: { id: true, name: true, grade: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      // Also fetch transport assignments for bus numbers
      const studentIds = enrollments.map((e) => e.student.id);
      const transports = studentIds.length > 0
        ? await prisma.studentTransport.findMany({
            where: {
              studentId: { in: studentIds },
              schoolId:  order.schoolId,
              isActive:  true,
            },
            include: {
              route: { select: { name: true, code: true } },
              stop:  { select: { name: true } },
            },
          })
        : [];

      const transportMap = {};
      transports.forEach((t) => {
        transportMap[t.studentId] = t.route?.code || t.route?.name || "—";
      });

      students = enrollments.map((e) => ({
        id:            e.student.id,
        name:          `${e.student.personalInfo?.firstName || ""} ${e.student.personalInfo?.lastName || ""}`.trim(),
        admissionNo:   e.admissionNumber,
        // Use the order className (e.g. "1-A") so frontend filter s.class === selectedClass works
        class:         sectionToOrderClass[e.classSectionId] || e.classSection.name,
        grade:         e.classSection.grade,
        fatherName:    e.student.personalInfo?.parentName  || "—",
        contactNo:     e.student.personalInfo?.parentPhone || e.student.personalInfo?.phone || "—",
        bloodGroup:    e.student.personalInfo?.bloodGroup  || "—",
        busNo:         transportMap[e.student.id]          || "—",
        profileImage:  e.student.personalInfo?.profileImage || null,
        email:         e.student.email,
      }));
    }

    // Parse cardBlocks + elementLayout out of the description JSON envelope
    const parsedOrder = { ...order, template: parseTemplateLayout(order.template) };

    return res.json({
      success: true,
      order:   parsedOrder,
      students,
      totalStudents: students.length,
      // Debug info — helps diagnose class name mismatches
      _debug: {
        orderClassNames:   classNames,
        dbClassSections:   allClassSections.map((cs) => ({ id: cs.id, name: cs.name })),
        matchedSections:   classSections.map((cs) => cs.name),
        classSectionIds,
        enrollmentCount:   students.length,
      },
    });
  } catch (err) {
    console.error("getOrderById error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};