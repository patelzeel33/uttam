import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router";
import {
  RefreshCw, Download, LogOut, Search, X, Settings,
  PlusCircle, ChevronLeft, ChevronRight, Users, Clock,
  CheckCircle2, XCircle, AlertCircle, BarChart3, Gift, Copy, Check
} from "lucide-react";
import Logo from "../components/Logo";

interface Applicant {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  city?: string;
  status: string;
  hoursLogged: number;
  submittedAt: string;
  referral_code?: string;
  ridersReferred?: number;
  referredByName?: string;
  referredByCode?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-blue-100 text-blue-700", icon: <Clock className="w-3 h-3" /> },
  interview: { label: "Interview", color: "bg-yellow-100 text-yellow-700", icon: <AlertCircle className="w-3 h-3" /> },
  active: { label: "Hired", color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> },
};

function getAuthHeader() {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedUser, setSelectedUser] = useState<Applicant | null>(null);
  const [addHours, setAddHours] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [quickUpdateId, setQuickUpdateId] = useState<string | null>(null);

  const adminEmail = localStorage.getItem("admin_email") || "Admin";

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        search,
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/applicants?${params}`, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch applicants");
      const data = await res.json();
      setApplicants(data.applicants || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin");
      return;
    }
    fetchApplicants();
  }, [fetchApplicants, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    navigate("/admin");
  };

  const handleQuickStatus = async (id: string, newStatus: string) => {
    setQuickUpdateId(id);
    try {
      const res = await fetch("/api/admin/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setQuickUpdateId(null);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUpdateLoading(true);
    try {
      const newHours = Number(selectedUser.hoursLogged || 0) + (addHours ? Number(addHours) : 0);
      const res = await fetch("/api/admin/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ id: selectedUser.id, status: selectedUser.status, hoursLogged: newHours }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setSelectedUser(null);
      setAddHours("");
      await fetchApplicants();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (applicants.length === 0) return;
    const headers = ["Name", "Phone", "Email", "Address", "City", "Status", "Hours", "Date"];
    const rows = applicants.map((a) => [
      `"${a.fullName}"`, `"${a.phoneNumber}"`, `"${a.email || ""}"`,
      `"${a.address || ""}"`, `"${a.city || ""}"`, `"${a.status}"`,
      `"${a.hoursLogged}"`, `"${new Date(a.submittedAt).toLocaleDateString()}"`,
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `applicants_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const statusCounts = {
    all: total,
    pending: applicants.filter((a) => a.status === "pending").length,
    interview: applicants.filter((a) => a.status === "interview").length,
    active: applicants.filter((a) => a.status === "active").length,
    rejected: applicants.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-blue-900 sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-auto" />
            <div>
              <h1 className="font-bold text-white text-base sm:text-lg leading-tight">Admin Dashboard</h1>
              <p className="text-blue-300 text-xs">{adminEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/reports" className="flex items-center gap-1.5 text-sm bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 hover:text-yellow-200 px-3 py-2 rounded-lg transition-colors font-medium">
              <BarChart3 className="w-4 h-4" /> Reports
            </Link>
            <Link to="/" className="text-blue-300 hover:text-white transition-colors text-sm hidden sm:block">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: total, color: "bg-blue-900", text: "text-white" },
            { label: "Pending", value: applicants.filter(a => a.status === "pending").length, color: "bg-yellow-400", text: "text-blue-900" },
            { label: "Hired", value: applicants.filter(a => a.status === "active").length, color: "bg-green-500", text: "text-white" },
            { label: "Rejected", value: applicants.filter(a => a.status === "rejected").length, color: "bg-red-500", text: "text-white" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-2xl p-4 shadow-sm`}>
              <div className={`text-3xl font-black ${stat.text}`}>{stat.value}</div>
              <div className={`text-sm font-medium ${stat.text} opacity-80`}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 sm:p-5 border-b border-gray-200 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, city…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={fetchApplicants}
                  className="flex items-center gap-1.5 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl transition-colors shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button
                  onClick={handleExportCSV}
                  disabled={applicants.length === 0}
                  className="flex items-center gap-1.5 text-sm bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white px-3 py-2 rounded-xl transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {["all", "pending", "interview", "active", "rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                    statusFilter === s
                      ? "bg-blue-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s === "active" ? "Hired" : s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-600 bg-red-50">
                <p className="font-medium">{error}</p>
                <button onClick={fetchApplicants} className="mt-3 text-sm underline hover:text-red-800">Try Again</button>
              </div>
            ) : applicants.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-medium text-gray-700 text-lg">No applicants found</p>
                <p className="text-sm mt-1">{search ? "Try a different search term" : "Applications will appear here once submitted"}</p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-100">
                  {applicants.map((app) => {
                    const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={app.id} className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{app.fullName}</div>
                            <div className="text-xs text-gray-400">#{app.id.slice(-6)}</div>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${sc.color}`}>
                            {sc.icon} {sc.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{app.phoneNumber}</span></div>
                          <div><span className="text-gray-500">Hours:</span> <span className="font-bold text-blue-900">{app.hoursLogged || 0}</span></div>
                          <div><span className="text-gray-500">City:</span> {app.city || app.address?.split(",").pop()?.trim() || "—"}</div>
                          <div><span className="text-gray-500">Date:</span> {new Date(app.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                        </div>
                        {/* Referral Info */}
                        <div className="bg-blue-50/50 rounded-lg p-2.5 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 flex items-center gap-1"><Gift className="w-3 h-3" /> Code:</span>
                            <span className="font-mono font-bold text-blue-700">{app.referral_code || '—'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Referred:</span>
                            <span className="font-bold text-green-700">{app.ridersReferred || 0} riders</span>
                          </div>
                          {app.referredByName && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Referred by:</span>
                              <span className="font-medium text-blue-800">{app.referredByName} <span className="font-mono text-blue-500">({app.referredByCode})</span></span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          {app.status !== "active" && (
                            <button onClick={() => handleQuickStatus(app.id, "active")} disabled={quickUpdateId === app.id} className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-50 text-green-700 py-2 rounded-lg border border-green-200 active:scale-95 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}
                          {app.status !== "rejected" && (
                            <button onClick={() => handleQuickStatus(app.id, "rejected")} disabled={quickUpdateId === app.id} className="flex-1 flex items-center justify-center gap-1 text-xs bg-red-50 text-red-700 py-2 rounded-lg border border-red-200 active:scale-95 font-medium">
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          )}
                          <button onClick={() => { setSelectedUser({ ...app }); setAddHours(""); }} className="flex-1 flex items-center justify-center gap-1 text-xs bg-blue-50 text-blue-700 py-2 rounded-lg border border-blue-200 active:scale-95 font-medium">
                            <Settings className="w-3.5 h-3.5" /> Manage
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table View */}
                <table className="w-full text-left min-w-[1100px] hidden md:table">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                      <th className="px-4 py-3 font-semibold">Applicant</th>
                      <th className="px-4 py-3 font-semibold">Contact</th>
                      <th className="px-4 py-3 font-semibold">City</th>
                      <th className="px-4 py-3 font-semibold text-center">Status</th>
                      <th className="px-4 py-3 font-semibold text-center">Referral</th>
                      <th className="px-4 py-3 font-semibold text-center">Hours</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applicants.map((app) => {
                      const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                      return (
                        <tr key={app.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-gray-900 text-sm">{app.fullName}</div>
                            <div className="text-xs text-gray-400">#{app.id.slice(-6)}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="text-sm font-medium text-gray-900">{app.phoneNumber}</div>
                            {app.email && <div className="text-xs text-gray-500 truncate max-w-[160px]">{app.email}</div>}
                          </td>
                          <td className="px-4 py-3.5 text-sm text-gray-600">{app.city || app.address?.split(",").pop()?.trim() || "—"}</td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${sc.color}`}>
                              {sc.icon} {sc.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div>
                              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{app.referral_code || '—'}</span>
                            </div>
                            <div className="mt-1">
                              <span className="text-xs font-bold text-green-700">{app.ridersReferred || 0}</span>
                              <span className="text-[10px] text-gray-400 ml-0.5">referred</span>
                            </div>
                            {app.referredByName && (
                              <div className="text-[10px] text-gray-500 mt-0.5">by {app.referredByName}</div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="font-bold text-blue-900">{app.hoursLogged || 0}</span>
                            <span className="text-xs text-gray-400 ml-1">hrs</span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-gray-500">
                            {new Date(app.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-end gap-1.5">
                              {app.status !== "active" && (
                                <button onClick={() => handleQuickStatus(app.id, "active")} disabled={quickUpdateId === app.id} title="Approve" className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
                              {app.status !== "rejected" && (
                                <button onClick={() => handleQuickStatus(app.id, "rejected")} disabled={quickUpdateId === app.id} title="Reject" className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button onClick={() => { setSelectedUser({ ...app }); setAddHours(""); }} className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors font-medium">
                                <Settings className="w-3.5 h-3.5" /> Manage
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Manage Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh]">
            <div className="bg-blue-900 text-white px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="font-bold text-lg">Manage Applicant</h3>
                <p className="text-blue-300 text-sm">{selectedUser.fullName} · #{selectedUser.id.slice(-6)}</p>
              </div>
              <button
                onClick={() => { setSelectedUser(null); setAddHours(""); }}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {/* Info */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 rounded-xl p-4 text-sm">
                <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedUser.phoneNumber}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedUser.email || "—"}</span></div>
                <div className="col-span-2"><span className="text-gray-500">Address:</span> <span className="font-medium">{selectedUser.address || "—"}</span></div>
              </div>
              {/* Referral Info Card */}
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-4 h-4 text-blue-700" />
                  <span className="text-sm font-bold text-blue-900 uppercase tracking-wide">Referral Info</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Code:</span>{" "}
                    <span className="font-mono font-bold text-blue-700">{selectedUser.referral_code || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Referred:</span>{" "}
                    <span className="font-bold text-green-700">{selectedUser.ridersReferred || 0} riders</span>
                  </div>
                  {selectedUser.referredByName && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Referred by:</span>{" "}
                      <span className="font-medium text-blue-800">{selectedUser.referredByName} <span className="font-mono text-blue-500">({selectedUser.referredByCode})</span></span>
                    </div>
                  )}
                </div>
              </div>

              <form id="manage-form" onSubmit={handleUpdateUser} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Application Status</label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium text-gray-900"
                  >
                    <option value="pending">Pending</option>
                    <option value="interview">Interview Stage</option>
                    <option value="active">Active (Hired)</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-900 uppercase tracking-wide">Time Tracking</span>
                    <span className="text-xs bg-white px-2 py-1 rounded text-blue-800 font-semibold shadow-sm">
                      Total: {selectedUser.hoursLogged || 0} hrs
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={updateLoading}
                      onClick={async () => {
                        setUpdateLoading(true);
                        try {
                          const res = await fetch("/api/admin/attendance", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", ...getAuthHeader() },
                            body: JSON.stringify({ applicantId: selectedUser.id, action: "login" }),
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error || "Failed to clock in");
                          alert("Clocked in successfully!");
                        } catch (err: any) {
                          alert(err.message);
                        } finally {
                          setUpdateLoading(false);
                        }
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Clock In
                    </button>
                    <button
                      type="button"
                      disabled={updateLoading}
                      onClick={async () => {
                        setUpdateLoading(true);
                        try {
                          const res = await fetch("/api/admin/attendance", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", ...getAuthHeader() },
                            body: JSON.stringify({ applicantId: selectedUser.id, action: "logout" }),
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error || "Failed to clock out");
                          alert(`Clocked out! Logged ${data.hoursWorked} hours today.`);
                          await fetchApplicants();
                          setSelectedUser(null);
                        } catch (err: any) {
                          alert(err.message);
                        } finally {
                          setUpdateLoading(false);
                        }
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Clock Out
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Use to log daily attendance for this delivery boy</p>

                  <div className="relative mt-2 border-t border-blue-200/50 pt-3">
                    <span className="text-xs font-semibold text-blue-900 mb-2 block">Or manual adjustment:</span>
                    <PlusCircle className="absolute left-3 top-[34px] -translate-y-1/2 text-blue-500 w-4 h-4" />
                    <input
                      type="number"
                      min="-100"
                      step="0.5"
                      value={addHours}
                      onChange={(e) => setAddHours(e.target.value)}
                      placeholder="Add or subtract hours"
                      className="w-full bg-white border border-blue-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => { setSelectedUser(null); setAddHours(""); }}
                type="button"
                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                form="manage-form"
                type="submit"
                disabled={updateLoading}
                className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                {updateLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
