// client/src/company/idcards/PrintCardPage.jsx
// Route: /id-cards/:orderId/print/:studentId
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, RefreshCw, Eye, EyeOff } from "lucide-react";
import { getTemplateComponent } from "./idCardTemplates.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

const FIELD_LABELS = {
  name:        "Student Name",
  photo:       "Photo",
  admissionNo: "Admission No.",
  class:       "Class",
  fatherName:  "Father's Name",
  bloodGroup:  "Blood Group",
  busNo:       "Bus No.",
  contactNo:   "Contact No.",
};

export default function PrintCardPage() {
  const { orderId, studentId } = useParams();
  const navigate  = useNavigate();
  const printRef  = useRef();

  const [student, setStudent] = useState(null);
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // Field visibility toggles — all on by default
  const [fields, setFields] = useState({
    name: true, photo: true, admissionNo: true,
    class: true, fatherName: true, bloodGroup: true,
    busNo: true, contactNo: true,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/api/id-cards/orders/${orderId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setOrder(data.order);
        const found = (data.students || []).find((s) => s.id === studentId);
        if (!found) throw new Error("Student not found in this order");
        setStudent(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, studentId]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#F3F5F7]">
      <RefreshCw size={28} className="animate-spin text-gray-400" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3 bg-[#F3F5F7]">
      <p className="text-red-500 font-bold">{error}</p>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500">
        <ArrowLeft size={14} /> Go Back
      </button>
    </div>
  );

  // ── Resolve template from order (never let user change it) ─────────────────
  const t             = order?.template;
  const templateKey   = t?.templateKey   || "CLASSIC_VERTICAL";
  const primaryColor  = t?.primaryColor  || "#384959";
  const accentColor   = t?.accentColor   || "#88BDF2";

  // Restore saved card customisations from the template's stored layout
  const savedBlocks   = t?.cardBlocks   || [];
  const savedElements = t?.elementLayout || null;
  const getB = (id) => savedBlocks.find((b) => b.id === id) || {};

  const CardComponent = getTemplateComponent(templateKey);

  // Build student data — respects field toggles
  const studentData = {
    name:        fields.name        ? student.name         : "",
    admissionNo: fields.admissionNo ? student.admissionNo  : "",
    class:       fields.class       ? student.class        : "",
    fatherName:  fields.fatherName  ? student.fatherName   : "",
    bloodGroup:  fields.bloodGroup  ? student.bloodGroup   : "",
    busNo:       fields.busNo       ? student.busNo        : "",
    contactNo:   fields.contactNo   ? student.contactNo    : "",
    photo:       fields.photo       ? student.profileImage : null,
    // Restore saved school-level customisations
    schoolName:  getB("schoolName").visible !== false ? (getB("schoolName").text || order?.schoolName || "") : undefined,
    location:    getB("location").visible   !== false ? (getB("location").text   || "") : undefined,
    footerText:  getB("footer").text || "STUDENT ID CARD",
    // Restore custom field layout if saved
    ...(savedElements ? {
      orderedElements: savedElements.map((el) => {
        // For built-in fields, inject the real student value
        const valueMap = {
          adm:     student.admissionNo,
          cls:     student.class,
          father:  student.fatherName,
          bus:     student.busNo,
          blood:   student.bloodGroup,
          contact: student.contactNo,
        };
        return { ...el, value: valueMap[el.id] || el.value };
      }),
      extraElements: savedElements.filter((e) => e.type === "custom"),
    } : {}),
  };

  const toggleField = (key) => setFields((f) => ({ ...f, [key]: !f[key] }));

  return (
    <>
      {/* ── Print CSS — card centered, full size, no extra whitespace ── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #print-card {
            width: 280px !important;
            transform: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      <div className="flex h-screen bg-[#F3F5F7] overflow-hidden">

        {/* ── Left sidebar: controls ── */}
        <div className="w-72 bg-white border-r border-gray-100 flex flex-col h-full shrink-0 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
              <ArrowLeft size={16} />
            </button>
            <div className="min-w-0">
              <p className="font-black text-[#1A1A1A] text-sm">Print ID Card</p>
              <p className="text-xs text-gray-400 truncate">{student.name}</p>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-5">

            {/* Template info (read-only — locked to order's template) */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Template</p>
              <div className="flex items-center gap-2">
                <div style={{ width: 14, height: 14, borderRadius: 3, background: primaryColor, border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
                <div style={{ width: 14, height: 14, borderRadius: 3, background: accentColor,  border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
                <p className="text-sm font-bold text-[#1A1A1A] truncate">{t?.title || "Default Template"}</p>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                {t?.templateType === "CODED" ? "⚡ Built-in design" : "🖼 Uploaded image"}
              </p>
            </div>

            {/* Student info */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Student</p>
              <p className="font-bold text-sm text-[#1A1A1A]">{student.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{student.admissionNo} · {student.class}</p>
              <p className="text-xs text-gray-400 mt-0.5">{order.schoolName}</p>
            </div>

            {/* Field toggles */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fields to Print</p>
              <div className="space-y-1.5">
                {Object.entries(FIELD_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleField(key)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all"
                    style={{
                      background: fields[key] ? "#fff7ed" : "white",
                      border:     `1.5px solid ${fields[key] ? "#FF5722" : "#e5e7eb"}`,
                    }}
                  >
                    <span className="text-xs font-bold" style={{ color: fields[key] ? "#FF5722" : "#6b7280" }}>
                      {label}
                    </span>
                    {fields[key]
                      ? <Eye size={13} style={{ color: "#FF5722" }} />
                      : <EyeOff size={13} className="text-gray-300" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Print button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#FF5722" }}
            >
              <Printer size={16} /> Print This Card
            </button>
          </div>
        </div>

        {/* ── Right: live preview — always centered ── */}
        <div id="print-area" className="flex-1 flex items-center justify-center bg-[#F3F5F7] overflow-auto p-8">
          <div className="flex flex-col items-center gap-5">

            {/* Live badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
              <span className="text-xs font-bold text-gray-500">Live Preview</span>
            </div>

            {/* Card — centered, natural width */}
            <div id="print-card" ref={printRef} style={{ width: 280 }}>
              <CardComponent
                theme={{ primary: primaryColor, accent: accentColor }}
                logo={null}
                student={studentData}
              />
            </div>

            <p className="text-xs text-gray-400 font-semibold">
              {order.schoolName} · {student.class}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}