// client/src/company/idcards/IdCardOrdersPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard, RefreshCw, Search,
  Clock, CheckCircle, Truck, Package, XCircle, Eye,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

const STATUS_CONFIG = {
  PENDING:    { label: "Pending",    color: "#f59e0b", bg: "#fffbeb", icon: Clock },
  CONFIRMED:  { label: "Confirmed",  color: "#3b82f6", bg: "#eff6ff", icon: CheckCircle },
  PROCESSING: { label: "Processing", color: "#8b5cf6", bg: "#f5f3ff", icon: Package },
  DISPATCHED: { label: "Dispatched", color: "#f97316", bg: "#fff7ed", icon: Truck },
  DELIVERED:  { label: "Delivered",  color: "#10b981", bg: "#f0fdf4", icon: CheckCircle },
  CANCELLED:  { label: "Cancelled",  color: "#ef4444", bg: "#fef2f2", icon: XCircle },
};

export default function IdCardOrdersPage() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("ALL");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res  = await fetch(`${API}/api/id-cards/orders?${params}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const filtered = orders.filter((o) =>
    o.schoolName?.toLowerCase().includes(search.toLowerCase()) ||
    o.school?.city?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    key,
    label: cfg.label,
    color: cfg.color,
    bg:    cfg.bg,
    count: orders.filter((o) => o.status === key).length,
  }));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">ID Card Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total orders across all schools</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Status stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(({ key, label, color, bg, count }) => (
          <button
            key={key}
            onClick={() => { setStatus(key === statusFilter ? "ALL" : key); setPage(1); }}
            className="rounded-2xl p-3 text-left transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: statusFilter === key ? bg : "white",
              border:     `1.5px solid ${statusFilter === key ? color : "#e5e7eb"}`,
            }}
          >
            <p className="text-2xl font-black" style={{ color }}>{count}</p>
            <p className="text-xs font-bold text-gray-500 mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by school name or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:border-[#FF5722] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:border-[#FF5722] transition-colors"
        >
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <RefreshCw size={24} className="animate-spin text-gray-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 rounded-3xl bg-white border border-gray-100">
          <CreditCard size={40} className="text-gray-200 mb-3" />
          <p className="font-bold text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const sc      = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
            const Icon    = sc.icon;
            const classes = Array.isArray(order.classDetails) ? order.classDetails : [];

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* School info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-[#1A1A1A] truncate">{order.schoolName}</p>
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        <Icon size={9} /> {sc.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {order.school?.city && `${order.school.city}, `}
                      {order.school?.state} · {order.school?.type}
                    </p>
                  </div>

                  {/* Order details */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-xl font-black text-[#FF5722]">{order.totalCards}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Cards</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Classes</p>
                      <div className="flex flex-wrap gap-1">
                        {classes.slice(0, 4).map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                            {c.className} ({c.studentCount})
                          </span>
                        ))}
                        {classes.length > 4 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">
                            +{classes.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {order.template && (
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Template</p>
                        <div className="flex items-center gap-1.5">
                          {order.template.primaryColor && (
                            <div style={{ width: 12, height: 12, borderRadius: 3, background: order.template.primaryColor }} />
                          )}
                          {order.template.accentColor && (
                            <div style={{ width: 12, height: 12, borderRadius: 3, background: order.template.accentColor }} />
                          )}
                          <span className="text-xs font-bold text-gray-600">{order.template.title}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Ordered</p>
                      <p className="text-xs font-bold text-gray-600">
                        {new Date(order.orderedAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* View button */}
                  <button
                    onClick={() => navigate(`/id-cards/${order.id}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold text-white shrink-0 transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "#FF5722" }}
                  >
                    <Eye size={14} /> View Order
                  </button>
                </div>

                {order.contactName && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-4 text-xs text-gray-400">
                    <span>Contact: <strong className="text-gray-600">{order.contactName}</strong></span>
                    {order.contactPhone && <span>📞 {order.contactPhone}</span>}
                    {order.contactEmail && <span>✉ {order.contactEmail}</span>}
                    {order.notes && <span>📝 {order.notes}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-2xl bg-white border border-gray-200 text-sm font-bold disabled:opacity-40 hover:bg-gray-50 transition-all"
          >
            ← Prev
          </button>
          <span className="text-sm font-bold text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-2xl bg-white border border-gray-200 text-sm font-bold disabled:opacity-40 hover:bg-gray-50 transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}