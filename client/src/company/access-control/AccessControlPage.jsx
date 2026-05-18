// client/src/company/access-control/AccessControlPage.jsx

import { useEffect, useState } from "react";
import {
  ShieldBan,
  Building2,
  Users,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (d) => {
  if (!d) return "Never";
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── Toggle Switch ──────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, loading, disabled }) => (
  <button
    onClick={onChange}
    disabled={loading || disabled}
    aria-checked={checked}
    role="switch"
    className={`
      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
      border-2 border-transparent transition-colors duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-1
      ${checked
        ? "bg-emerald-500 focus:ring-emerald-400"
        : "bg-gray-200 focus:ring-gray-300"
      }
      ${loading || disabled ? "opacity-50 cursor-not-allowed" : ""}
    `}
  >
    <span
      className={`
        pointer-events-none inline-block h-5 w-5 transform rounded-full
        bg-white shadow-sm ring-0 transition duration-200 ease-in-out
        ${checked ? "translate-x-5" : "translate-x-0"}
      `}
    />
  </button>
);

// ── Confirm Dialog ─────────────────────────────────────────────────────────────
const ConfirmDialog = ({ open, title, message, changes, onConfirm, onCancel, loading, type }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-4 overflow-hidden">
        <div className={`px-6 py-4 border-b ${type === "deactivate" ? "border-red-100 bg-red-50" : "border-emerald-100 bg-emerald-50"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${type === "deactivate" ? "bg-red-100" : "bg-emerald-100"}`}>
              <ShieldBan size={18} className={type === "deactivate" ? "text-red-600" : "text-emerald-600"} />
            </div>
            <h3 className={`text-sm font-bold ${type === "deactivate" ? "text-red-700" : "text-emerald-700"}`}>{title}</h3>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 mb-4">{message}</p>

          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1.5">
            <p className="font-semibold text-gray-700 mb-2 text-[11px] uppercase tracking-wider">What changes</p>
            {changes.map((c, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">•</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-5 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-5 py-2 text-sm font-bold text-white rounded-xl transition-all disabled:opacity-50
              flex items-center gap-2
              ${type === "deactivate" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}
            `}
          >
            {loading && <RefreshCw size={14} className="animate-spin" />}
            {loading ? "Processing..." : type === "deactivate" ? "Yes, Deactivate" : "Yes, Reactivate"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── University Row ─────────────────────────────────────────────────────────────
const UniversityRow = ({ uni, onToggleUni, onToggleAdmin, togglingId }) => {
  const [expanded, setExpanded] = useState(false);
  const isActive = !uni.isDeactivated;

  return (
    <div className={`
      bg-white rounded-2xl border transition-all duration-200
      ${isActive ? "border-gray-100" : "border-red-100"}
    `}>
      {/* University Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Icon */}
            <div className={`
              w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg font-black
              ${isActive ? "bg-orange-50 text-[#FF5722]" : "bg-red-50 text-red-400"}
            `}>
              {uni.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-[#1A1A1A] tracking-tight truncate">{uni.name}</h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {uni.code}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                {uni.email && (
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Mail size={10} /> {uni.email}
                  </span>
                )}
                {uni.phone && (
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Phone size={10} /> {uni.phone}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {/* Status badge */}
                <span className={`
                  inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full
                  ${isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                  }
                `}>
                  {isActive
                    ? <><CheckCircle2 size={10} /> Active</>
                    : <><XCircle size={10} /> Deactivated</>
                  }
                </span>

                {/* Schools */}
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                  <Building2 size={10} />
                  {uni.totalSchools} {uni.totalSchools === 1 ? "school" : "schools"}
                </span>

                {/* Admins */}
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                  <Users size={10} />
                  {uni.superAdmins.length} {uni.superAdmins.length === 1 ? "admin" : "admins"}
                </span>

                {/* Deactivated at */}
                {uni.deactivatedAt && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-red-400">
                    <Clock size={10} />
                    Deactivated {formatDate(uni.deactivatedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <Toggle
                checked={isActive}
                onChange={() => onToggleUni(uni)}
                loading={togglingId === uni.id}
              />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {togglingId === uni.id ? "..." : isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <button
              onClick={() => setExpanded((p) => !p)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 transition-all"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded — Super Admins */}
      {expanded && (
        <div className="border-t border-gray-50 px-5 pb-5 pt-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Super Admins
          </p>

          {uni.superAdmins.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No super admins found.</p>
          ) : (
            <div className="space-y-2">
              {uni.superAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className={`
                    flex items-center justify-between gap-4 rounded-xl px-4 py-3 border
                    ${admin.isActive ? "bg-gray-50/50 border-gray-100" : "bg-red-50/30 border-red-100"}
                  `}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`
                      w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black
                      ${admin.isActive ? "bg-white border border-gray-200 text-[#1A1A1A]" : "bg-red-100 text-red-500"}
                    `}>
                      {admin.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1A1A1A] truncate">{admin.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{admin.email}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Last login: {formatDateTime(admin.lastLoginAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <Toggle
                      checked={admin.isActive}
                      onChange={() => onToggleAdmin(admin, uni)}
                      loading={togglingId === admin.id}
                      disabled={uni.isDeactivated}
                    />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {togglingId === admin.id ? "..." : admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const AccessControlPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    changes: [],
    type: "deactivate",
    onConfirm: null,
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/access-control`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUniversities(data.data);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Toggle University ──────────────────────────────────────────────────────
    const handleToggleUni = (uni) => {
        const reactivating = uni.isDeactivated;
        setConfirm({
        open: true,
        type: reactivating ? "activate" : "deactivate",
        title: reactivating
            ? `Reactivate ${uni.name}?`
            : `Deactivate ${uni.name}?`,
        message: reactivating
            ? "This will restore all super admin logins for this university. All schools and data remain fully intact."
            : "This will immediately suspend all super admin logins for this university.",
        changes: reactivating
            ? [
                `University Status → Active`,
                `All ${uni.superAdmins.length} super admin(s) → Active`,
                "Restores login access for the entire institution",
            ]
            : [
                `University Status → Inactive`,
                `All ${uni.superAdmins.length} super admin(s) → Inactive`,
                "Schools and all data remain preserved",
                "Revokes login access for all admins",
            ],
        onConfirm: async () => {
            setTogglingId(uni.id);
            setConfirm((p) => ({ ...p, open: false }));
            try {
            const res = await fetch(`${API_URL}/api/access-control/universities/${uni.id}/toggle`, {
                method: "PATCH",
                headers: authHeaders(),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            await fetchData();
            } catch (err) {
            alert(err.message || "Failed to toggle university");
            } finally {
            setTogglingId(null);
            }
        },
        });
    };

  // ── Toggle Super Admin ─────────────────────────────────────────────────────
    const handleToggleAdmin = (admin, uni) => {
        if (uni.isDeactivated) return;
        const activating = !admin.isActive;
        setConfirm({
        open: true,
        type: activating ? "activate" : "deactivate",
        title: activating
            ? `Enable ${admin.name}'s access?`
            : `Disable ${admin.name}'s access?`,
        message: activating
            ? `This will restore login access for ${admin.name}. The university remains unchanged.`
            : `This will revoke login access for ${admin.name} only. Other admins and the university are unaffected.`,
        changes: activating
            ? [`Admin Status → Active (${admin.email})`]
            : [`Admin Status → Inactive (${admin.email})`],
        onConfirm: async () => {
            setTogglingId(admin.id);
            setConfirm((p) => ({ ...p, open: false }));
            try {
            const res = await fetch(`${API_URL}/api/access-control/super-admins/${admin.id}/toggle`, {
                method: "PATCH",
                headers: authHeaders(),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            await fetchData();
            } catch (err) {
            alert(err.message || "Failed to toggle admin");
            } finally {
            setTogglingId(null);
            }
        },
        });
    };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    total: universities.length,
    active: universities.filter((u) => !u.isDeactivated).length,
    deactivated: universities.filter((u) => u.isDeactivated).length,
    totalAdmins: universities.reduce((s, u) => s + u.superAdmins.length, 0),
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#1A1A1A] uppercase italic">
            Access Control
          </h1>
          <p className="text-sm text-gray-400 mt-0.5 font-medium">
            Manage university and super admin access
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Universities", value: stats.total, color: "text-[#1A1A1A]", bg: "bg-white" },
          { label: "Active", value: stats.active, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Deactivated", value: stats.deactivated, color: "text-red-500", bg: "bg-red-50" },
          { label: "Super Admins", value: stats.totalAdmins, color: "text-[#FF5722]", bg: "bg-orange-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <XCircle size={24} className="text-red-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-3 text-xs font-bold text-red-500 underline"
          >
            Try again
          </button>
        </div>
      ) : universities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <ShieldBan size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-400">No universities found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {universities.map((uni) => (
            <UniversityRow
              key={uni.id}
              uni={uni}
              onToggleUni={handleToggleUni}
              onToggleAdmin={handleToggleAdmin}
              togglingId={togglingId}
            />
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        {...confirm}
        loading={togglingId !== null}
        onCancel={() => setConfirm((p) => ({ ...p, open: false }))}
      />
    </div>
  );
};

export default AccessControlPage;