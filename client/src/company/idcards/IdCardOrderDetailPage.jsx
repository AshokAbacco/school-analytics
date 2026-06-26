// client/src/company/idcards/IdCardOrderDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, RefreshCw, Clock, CheckCircle,
  Truck, Package, XCircle, User, Phone,
  Droplets, Bus, Users, ChevronDown, ChevronRight,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";
const PAGE_SIZE = 20;

const STATUS_CONFIG = {
  PENDING:    { label: "Pending",    color: "#f59e0b", bg: "#fffbeb", icon: Clock },
  CONFIRMED:  { label: "Confirmed",  color: "#3b82f6", bg: "#eff6ff", icon: CheckCircle },
  PROCESSING: { label: "Processing", color: "#8b5cf6", bg: "#f5f3ff", icon: Package },
  DISPATCHED: { label: "Dispatched", color: "#f97316", bg: "#fff7ed", icon: Truck },
  DELIVERED:  { label: "Delivered",  color: "#10b981", bg: "#f0fdf4", icon: CheckCircle },
  CANCELLED:  { label: "Cancelled",  color: "#ef4444", bg: "#fef2f2", icon: XCircle },
};

export default function IdCardOrderDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [order, setOrder]       = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // UI state
  const [selectedClass, setSelectedClass] = useState(null);
  const [classOpen, setClassOpen]         = useState(false);
  const [page, setPage]                   = useState(1);

  const fetchOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API}/api/id-cards/orders/${id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load order");
      setOrder(data.order);
      setStudents(data.students || []);

      // Auto-select first class
      const classes = data.order?.classDetails || [];
      if (classes.length > 0) setSelectedClass(classes[0].className);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  // Reset page when class changes
  useEffect(() => { setPage(1); }, [selectedClass]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw size={24} className="animate-spin text-gray-400" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-red-500 font-bold">{error}</p>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500">
        <ArrowLeft size={14} /> Go Back
      </button>
    </div>
  );

  if (!order) return null;

  const sc          = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const StatusIcon  = sc.icon;
  const classDets   = Array.isArray(order.classDetails) ? order.classDetails : [];

  // Students for selected class
  const classStudents = students.filter((s) => s.class === selectedClass);
  const totalPages    = Math.ceil(classStudents.length / PAGE_SIZE);
  const pagedStudents = classStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Selected class info
  const selectedClassInfo = classDets.find((c) => c.className === selectedClass);

  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Orders
      </button>

      {/* ── Order Header ── */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-black text-[#1A1A1A]">{order.schoolName}</h1>
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: sc.bg, color: sc.color }}
              >
                <StatusIcon size={11} /> {sc.label}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {order.school?.city && `${order.school.city}, `}
              {order.school?.state} · {order.school?.type}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Ordered on {new Date(order.orderedAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>

          <div className="text-center bg-orange-50 rounded-2xl px-6 py-4 shrink-0">
            <p className="text-4xl font-black text-[#FF5722]">{order.totalCards}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Cards</p>
          </div>
        </div>

        {/* Template */}
        {order.template && (
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-3">
            {order.template.primaryColor && (
              <div className="flex gap-1">
                <div style={{ width: 16, height: 16, borderRadius: 4, background: order.template.primaryColor }} />
                <div style={{ width: 16, height: 16, borderRadius: 4, background: order.template.accentColor }} />
              </div>
            )}
            <span className="text-sm font-bold text-gray-600">Template: {order.template.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">
              {order.template.templateType === "CODED" ? "⚡ Built-in" : "🖼 Uploaded"}
            </span>
          </div>
        )}

        {/* Contact */}
        {order.contactName && (
          <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>👤 <strong>{order.contactName}</strong></span>
            {order.contactPhone && <span>📞 {order.contactPhone}</span>}
            {order.contactEmail && <span>✉ {order.contactEmail}</span>}
          </div>
        )}

        {order.notes && (
          <div className="mt-3 px-4 py-3 rounded-xl bg-yellow-50 text-sm text-yellow-800 font-medium">
            📝 {order.notes}
          </div>
        )}
      </div>

      {/* ── School Card (clickable, shows class picker inside) ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        {/* School row */}
        <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setClassOpen((v) => !v)}>
          <div className="flex items-center gap-4">
            {/* School avatar */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5722] to-orange-400 flex items-center justify-center text-white font-black text-lg shrink-0">
              {order.schoolName?.charAt(0)}
            </div>
            <div>
              <p className="font-black text-[#1A1A1A]">{order.schoolName}</p>
              <p className="text-xs text-gray-400">
                {classDets.length} class{classDets.length !== 1 ? "es" : ""} · {order.totalCards} cards
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-1.5">
              {classDets.map((c, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                  {c.className}
                </span>
              ))}
            </div>
            {classOpen
              ? <ChevronDown size={16} className="text-gray-400 shrink-0" />
              : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
          </div>
        </div>

        {/* ── Class picker + students (expanded) ── */}
        {classOpen && (
          <div style={{ borderTop: "1px solid #f3f4f6" }}>

            {/* Class section dropdown */}
            <div className="p-4 bg-gray-50 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Class Section:</span>
              <div className="relative">
                <select
                  value={selectedClass || ""}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold text-[#1A1A1A] outline-none focus:border-[#FF5722] cursor-pointer transition-colors"
                >
                  {classDets.map((c, i) => (
                    <option key={i} value={c.className}>
                      {c.className} ({c.studentCount} students)
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Selected class badge */}
              {selectedClassInfo && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50">
                  <Users size={13} className="text-[#FF5722]" />
                  <span className="text-xs font-bold text-[#FF5722]">
                    {classStudents.length} loaded · {selectedClassInfo.studentCount} ordered
                  </span>
                </div>
              )}
            </div>

            {/* Students table */}
            {classStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <User size={32} className="text-gray-200" />
                <p className="text-sm font-bold text-gray-400">No students found for this class</p>
                <p className="text-xs text-gray-400">Class name may not match exactly in the DB</p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="grid grid-cols-12 px-5 py-2.5 bg-gray-50 border-t border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Adm. No.</div>
                  <div className="col-span-2">Father</div>
                  <div className="col-span-1">Blood</div>
                  <div className="col-span-1">Bus</div>
                  <div className="col-span-1">Contact</div>
                  <div className="col-span-1">Print</div>
                </div>

                {/* Student rows */}
                <div className="divide-y divide-gray-50">
                  {pagedStudents.map((student, idx) => (
                    <div key={student.id} className="grid grid-cols-12 px-5 py-3.5 hover:bg-gray-50 transition-colors items-center">
                      <div className="col-span-1 text-xs font-bold text-gray-400">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </div>
                      <div className="col-span-3 flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF5722] to-orange-300 flex items-center justify-center text-white font-black text-xs shrink-0">
                          {student.name?.charAt(0) || "?"}
                        </div>
                        <p className="text-sm font-bold text-[#1A1A1A] truncate">{student.name}</p>
                      </div>
                      <div className="col-span-2 text-xs text-gray-500 font-semibold">
                        {student.admissionNo}
                      </div>
                      <div className="col-span-2 text-xs text-gray-500 truncate">
                        {student.fatherName !== "—" ? student.fatherName : "—"}
                      </div>
                      <div className="col-span-1">
                        {student.bloodGroup !== "—" ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold">
                            <Droplets size={9} /> {student.bloodGroup}
                          </span>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </div>
                      <div className="col-span-1 text-xs text-gray-500 font-semibold">
                        {student.busNo !== "—" ? (
                          <span className="flex items-center gap-1">
                            <Bus size={10} className="text-gray-400" /> {student.busNo}
                          </span>
                        ) : "—"}
                      </div>
                      <div className="col-span-1 text-xs text-gray-500">
                        {student.contactNo !== "—" ? student.contactNo : "—"}
                      </div>
                      {/* 🖨 Print button */}
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => navigate(`/id-cards/${id}/print/${student.id}`)}
                          className="px-2.5 py-1.5 rounded-xl text-[10px] font-black text-white transition-all hover:opacity-90 active:scale-95"
                          style={{ background: "#FF5722" }}
                          title={`Print ID card for ${student.name}`}
                        >
                          🖨 Print
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs font-bold text-gray-400">
                      Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, classStudents.length)} of {classStudents.length} students
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-gray-50 transition-all"
                      >
                        ← Prev
                      </button>
                      <span className="text-xs font-bold text-gray-500">
                        {page} / {totalPages}
                      </span>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-gray-50 transition-all"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}