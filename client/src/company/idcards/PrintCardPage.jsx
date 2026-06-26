// client/src/company/idcards/PrintCardPage.jsx
// Full-screen single card preview + print for Abacco Admin
// Route: /id-cards/:orderId/print/:studentId
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Printer, RefreshCw, Palette,
  RotateCcw, Eye, EyeOff,
} from "lucide-react";

// ── Import all templates from School Management project
// Copy idCardTemplates.jsx into client/src/company/idcards/
import {
  ClassicVerticalCard,
  HorizontalSplitCard,
  MinimalModernCard,
  RoyalSouthIndianCard,
  MaroonCreamCard,
  CBSEGreenCard,
  CorporateSidebarCard,
} from "./idCardTemplates.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

const TEMPLATE_MAP = {
  CLASSIC_VERTICAL:  ClassicVerticalCard,
  NAVY_HORIZONTAL:   HorizontalSplitCard,
  MINIMAL_MODERN:    MinimalModernCard,
  ROYAL_SOUTH:       RoyalSouthIndianCard,
  MAROON_CREAM:      MaroonCreamCard,
  CBSE_GREEN:        CBSEGreenCard,
  CORPORATE_SIDEBAR: CorporateSidebarCard,
};

const ALL_TEMPLATES = [
  { key: "CLASSIC_VERTICAL",  label: "Classic Vertical" },
  { key: "NAVY_HORIZONTAL",   label: "Horizontal Split" },
  { key: "MINIMAL_MODERN",    label: "Minimal Modern" },
  { key: "ROYAL_SOUTH",       label: "Royal South Indian" },
  { key: "MAROON_CREAM",      label: "Maroon & Cream" },
  { key: "CBSE_GREEN",        label: "CBSE Green" },
  { key: "CORPORATE_SIDEBAR", label: "Corporate Sidebar" },
];

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

const PRESETS = [
  { primary: "#1a5c38", accent: "#c9a84c", label: "Green Gold" },
  { primary: "#1e3a5f", accent: "#e8b84b", label: "Navy Gold" },
  { primary: "#7b1f1f", accent: "#d4a853", label: "Maroon Gold" },
  { primary: "#1a237e", accent: "#ff6f00", label: "Blue Orange" },
  { primary: "#212121", accent: "#e53935", label: "Black Red" },
];

export default function PrintCardPage() {
  const { orderId, studentId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const [student, setStudent]       = useState(null);
  const [order, setOrder]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // Template & theme
  const [templateKey, setTemplateKey]   = useState("CLASSIC_VERTICAL");
  const [theme, setTheme]               = useState({ primary: "#1a5c38", accent: "#c9a84c" });

  // Field toggles — all on by default
  const [fields, setFields] = useState({
    name:        true,
    photo:       true,
    admissionNo: true,
    class:       true,
    fatherName:  true,
    bloodGroup:  true,
    busNo:       true,
    contactNo:   true,
  });

  // Fetch order + find student
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/api/id-cards/orders/${orderId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        setOrder(data.order);

        // Set template from order
        const t = data.order?.template;
        if (t?.templateKey) setTemplateKey(t.templateKey);
        if (t?.primaryColor) setTheme({ primary: t.primaryColor, accent: t.accentColor || "#c9a84c" });

        // Find the student
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

  const handlePrint = () => window.print();

  const toggleField = (key) => setFields((f) => ({ ...f, [key]: !f[key] }));

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <RefreshCw size={28} className="animate-spin text-gray-400" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <p className="text-red-500 font-bold">{error}</p>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500">
        <ArrowLeft size={14} /> Go Back
      </button>
    </div>
  );

  // Build student data with field toggles applied
  const studentData = {
    name:        fields.name        ? student.name        : "",
    admissionNo: fields.admissionNo ? student.admissionNo : "",
    class:       fields.class       ? student.class       : "",
    fatherName:  fields.fatherName  ? student.fatherName  : "",
    bloodGroup:  fields.bloodGroup  ? student.bloodGroup  : "",
    busNo:       fields.busNo       ? student.busNo       : "",
    contactNo:   fields.contactNo   ? student.contactNo   : "",
    photo:       fields.photo       ? student.profileImage : null,
  };

  const CardComponent = TEMPLATE_MAP[templateKey] || ClassicVerticalCard;

  return (
    <>
      {/* ── Print styles ── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-card, #print-card * { visibility: visible; }
          #print-card {
            position: fixed;
            top: 0; left: 0;
            width: 85.6mm;
            height: 54mm;
            overflow: hidden;
          }
          @page {
            size: 85.6mm 54mm;
            margin: 0;
          }
        }
      `}</style>

      <div className="flex h-screen bg-[#F3F5F7] overflow-hidden">

        {/* ── Left: Controls ── */}
        <div className="w-80 bg-white border-r border-gray-100 flex flex-col h-full shrink-0 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <p className="font-black text-[#1A1A1A] text-sm">Print ID Card</p>
              <p className="text-xs text-gray-400 truncate">{student?.name}</p>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-5">

            {/* Template selector */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Template</p>
              <select
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-[#1A1A1A] outline-none focus:border-[#FF5722] transition-colors"
              >
                {ALL_TEMPLATES.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
              {order?.template && (
                <p className="text-[10px] text-gray-400 mt-1 ml-1">
                  School selected: <strong>{order.template.title}</strong>
                </p>
              )}
            </div>

            {/* Colors */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Colors</p>
              <div className="space-y-3">
                {/* Primary */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">Primary</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg border border-gray-200" style={{ background: theme.primary }} />
                    <input
                      type="color"
                      value={theme.primary}
                      onChange={(e) => setTheme((t) => ({ ...t, primary: e.target.value }))}
                      className="w-8 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-gray-400">{theme.primary}</span>
                  </div>
                </div>
                {/* Accent */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">Accent</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg border border-gray-200" style={{ background: theme.accent }} />
                    <input
                      type="color"
                      value={theme.accent}
                      onChange={(e) => setTheme((t) => ({ ...t, accent: e.target.value }))}
                      className="w-8 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-gray-400">{theme.accent}</span>
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setTheme({ primary: p.primary, accent: p.accent })}
                    title={p.label}
                    className="flex gap-0.5 rounded-lg overflow-hidden border border-gray-200 hover:scale-110 transition-transform"
                  >
                    <div style={{ width: 18, height: 18, background: p.primary }} />
                    <div style={{ width: 18, height: 18, background: p.accent }} />
                  </button>
                ))}
                <button
                  onClick={() => setTheme({ primary: "#1a5c38", accent: "#c9a84c" })}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 text-[10px] font-bold text-gray-500 hover:bg-gray-50"
                >
                  <RotateCcw size={9} /> Reset
                </button>
              </div>
            </div>

            {/* Field toggles */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fields to Print</p>
              <div className="space-y-1.5">
                {Object.entries(FIELD_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleField(key)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all"
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

            {/* Student info */}
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Student</p>
              <p className="font-bold text-sm text-[#1A1A1A]">{student.name}</p>
              <p className="text-xs text-gray-500">{student.admissionNo} · {student.class}</p>
              <p className="text-xs text-gray-400 mt-1">{order.schoolName}</p>
            </div>
          </div>

          {/* Print button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#FF5722" }}
            >
              <Printer size={16} /> Print This Card
            </button>
          </div>
        </div>

        {/* ── Right: Card Preview ── */}
        <div className="flex-1 flex items-center justify-center bg-[#F3F5F7] overflow-auto p-8">
          <div className="flex flex-col items-center gap-4">

            {/* Label */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
              <span className="text-xs font-bold text-gray-500">Live Preview — CR80 Card Size</span>
            </div>

            {/* Card preview — wrapped in print target */}
            <div
              id="print-card"
              ref={printRef}
              style={{
                width: 323,   // 85.6mm at 96dpi
                height: 204,  // 54mm at 96dpi — only for landscape; portrait is taller
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardComponent
                theme={theme}
                logo={null}
                student={studentData}
              />
            </div>

            {/* Actual size note */}
            <p className="text-xs text-gray-400 font-semibold">
              Actual print size: 85.6mm × 54mm (CR80 standard)
            </p>
          </div>
        </div>
      </div>
    </>
  );
}