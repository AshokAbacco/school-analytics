import prisma from "../config/prismaClient.js";

export const getDashboardAnalytics = async () => {
  // =========================
  // TOTAL COUNTS
  // =========================
  const totalSchools = await prisma.school.count();
  const totalUniversities = await prisma.university.count();
  const totalSubscriptions = await prisma.subscription.count({
    where: { status: "ACTIVE" },
  });

  // =========================
  // PAYMENTS — use exact field names from School Analytics schema
  // school → School (capital S), Subscription → subscriptions
  // =========================
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id:                true,
      createdAt:         true,
      fullName:          true,
      schoolName:        true,
      email:             true,
      phone:             true,
      address:           true,
      planId:            true,
      planName:          true,
      planPrice:         true,
      maxSchools:        true,
      maxStudents:       true,
      maxTeachers:       true,
      maxSchoolAdmins:   true,
      planStartDate:     true,
      planEndDate:       true,
      userCount:         true,
      studentCount:      true,
      teacherCount:      true,
      amount:            true,
      razorpayOrderId:   true,
      razorpayPaymentId: true,
      status:            true,
      superAdminId:      true,
      universityId:      true,
      schoolId:          true,
      university: {
        select: { id: true, name: true },
      },
      School: {                          // ← capital S
        select: {
          id:   true,
          name: true,
          type: true,
          university: {
            select: { id: true, name: true },
          },
        },
      },
      subscriptions: {                   // ← lowercase
        select: {
          id:     true,
          status: true,
          plan: {
            select: {
              id:              true,
              name:            true,
              price:           true,
              maxSchools:      true,
              maxStudents:     true,
              maxTeachers:     true,
              maxSchoolAdmins: true,
              features:        true,
              isActive:        true,
            },
          },
        },
      },
    },
  });

  // =========================
  // SUCCESS PAYMENTS
  // =========================
  const successfulPayments = payments.filter((p) => p.status === "SUCCESS");

  // =========================
  // REVENUE
  // =========================
  const totalRevenue = successfulPayments.reduce(
    (acc, item) => acc + Number(item.amount), 0
  );

  const currentMonth = new Date().getMonth();
  const currentYear  = new Date().getFullYear();

  const monthlyRevenue = successfulPayments
    .filter((p) => {
      const d = new Date(p.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, item) => acc + Number(item.amount), 0);

  // =========================
  // UNIVERSITY ANALYTICS
  // =========================
  const universityMap = {};

  successfulPayments.forEach((payment) => {
    const universityName =
      payment.university?.name ||
      payment.School?.university?.name ||
      "Unknown University";

    if (!universityMap[universityName]) {
      universityMap[universityName] = { universityName, revenue: 0, schools: new Set() };
    }

    universityMap[universityName].revenue += Number(payment.amount);

    if (payment.School?.name) {
      universityMap[universityName].schools.add(payment.School.name);
    }
  });

  const universityAnalytics = Object.values(universityMap).map((item) => ({
    universityName: item.universityName,
    revenue:        item.revenue,
    totalSchools:   item.schools.size,
  }));

  // =========================
  // PLAN ANALYTICS
  // =========================
  const planMap = {};

  successfulPayments.forEach((payment) => {
    const subs = payment.subscriptions || [];

    if (subs.length === 0) {
      const planName = payment.planName || "Basic Plan";
      if (!planMap[planName]) planMap[planName] = { planName, revenue: 0, subscriptions: 0 };
      planMap[planName].revenue       += Number(payment.amount);
      planMap[planName].subscriptions += 1;
      return;
    }

    subs.forEach((sub) => {
      const planName = sub.plan?.name || payment.planName || "Basic Plan";
      if (!planMap[planName]) planMap[planName] = { planName, revenue: 0, subscriptions: 0 };
      planMap[planName].revenue       += Number(payment.amount);
      planMap[planName].subscriptions += 1;
    });
  });

  const planAnalytics = Object.values(planMap);

  // =========================
  // RECENT PAYMENTS (last 10)
  // =========================
  const recentPayments = payments.slice(0, 10).map((payment) => ({
    id:         payment.id,
    school:     payment.School?.name || payment.schoolName || "N/A",
    university: payment.university?.name || payment.School?.university?.name || "Unknown University",
    amount:     payment.amount,
    status:     payment.status,
    plan:       payment.subscriptions?.[0]?.plan?.name || payment.planName || "Basic Plan",
    createdAt:  payment.createdAt,
  }));

  return {
    summary: {
      totalRevenue,
      monthlyRevenue,
      totalSchools,
      totalUniversities,
      totalSubscriptions,
      successfulPayments: successfulPayments.length,
      failedPayments:  payments.filter((p) => p.status === "FAILED").length,
      pendingPayments: payments.filter((p) => p.status === "PENDING").length,
    },
    universityAnalytics,
    planAnalytics,
    recentPayments,
  };
};