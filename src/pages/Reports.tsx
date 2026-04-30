import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router";
import {
  BarChart3, Download, LogOut, Calendar, Users, Clock,
  TrendingUp, Percent, ChevronLeft, ChevronRight, Filter,
  FileSpreadsheet, ArrowLeft, RefreshCw, AlertCircle
} from "lucide-react";
import Logo from "../components/Logo";

interface PerformanceRow {
  applicantId: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  city?: string;
  status: string;
  totalHours: number;
  daysWorked: number;
  totalSessions: number;
  avgHoursPerDay: number;
  maxHoursInDay: number;
  minHoursInDay: number;
  attendancePercentage: number;
}

interface DailyBreakdown {
  date: string;
  totalHours: number;
  workerCount: number;
  sessions: number;
}

interface ReportSummary {
  totalActiveEmployees: number;
  employeesWithAttendance: number;
  totalHoursWorked: number;
  avgAttendancePercentage: number;
}

interface ReportData {
  month: number;
  year: number;
  totalWorkingDays: number;
  summary: ReportSummary;
  performance: PerformanceRow[];
  dailyBreakdown: DailyBreakdown[];
}

function getAuthHeader() {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function Reports() {
  const navigate = useNavigate();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [sortField, setSortField] = useState<string>("totalHours");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const adminEmail = localStorage.getItem("admin_email") || "Admin";

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ month: String(month), year: String(year) });
      const res = await fetch(`/api/admin/reports?${params}`, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      if (res.status === 401) { localStorage.removeItem("admin_token"); navigate("/admin"); return; }
      if (!res.ok) throw new Error("Failed to fetch report");
      const data = await res.json();
      console.log("[Reports] Fetched data:", data);
      setReport(data.report);
    } catch (err: any) {
      console.error("[Reports] Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [month, year, navigate]);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) { navigate("/admin"); return; }
    fetchReport();
  }, [fetchReport, navigate]);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({ month: String(month), year: String(year), format: "csv" });
      const res = await fetch(`/api/admin/export-report?${params}`, {
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${year}_${String(month).padStart(2, "0")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Export failed: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    navigate("/admin");
  };

  const changeMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setMonth(m);
    setYear(y);
  };

  const sorted = report?.performance ? [...report.performance].sort((a: any, b: any) => {
    const va = a[sortField] ?? 0;
    const vb = b[sortField] ?? 0;
    return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  }) : [];

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  // Chart helpers
  const maxDailyHours = report?.dailyBreakdown ? Math.max(...report.dailyBreakdown.map(d => d.totalHours), 1) : 1;
  const maxWorkers = report?.dailyBreakdown ? Math.max(...report.dailyBreakdown.map(d => d.workerCount), 1) : 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-auto" />
            <div>
              <h1 className="font-bold text-white text-base sm:text-lg leading-tight flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" /> Reports & Analytics
              </h1>
              <p className="text-blue-300 text-xs">{adminEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center gap-1 text-blue-300 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Month Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => changeMonth(-1)} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                <Calendar className="w-5 h-5 text-blue-900" />
                <span className="font-bold text-blue-900 text-lg">{MONTHS[month - 1]} {year}</span>
              </div>
              <button onClick={() => changeMonth(1)} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors" disabled={month === now.getMonth() + 1 && year === now.getFullYear()}>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={fetchReport} disabled={loading} className="flex items-center gap-1.5 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl transition-colors shadow-sm">
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
              <button onClick={handleExportCSV} disabled={exporting || !report?.performance?.length} className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl transition-colors shadow-sm font-medium">
                <FileSpreadsheet className="w-4 h-4" /> {exporting ? "Exporting…" : "Export CSV"}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="font-medium text-red-700">{error}</p>
            <button onClick={fetchReport} className="mt-3 text-sm underline text-red-600 hover:text-red-800">Try Again</button>
          </div>
        ) : report ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Active Employees", value: report.summary.totalActiveEmployees, icon: <Users className="w-6 h-6" />, color: "from-blue-600 to-blue-800" },
                { label: "Total Hours Worked", value: report.summary.totalHoursWorked.toFixed(1), icon: <Clock className="w-6 h-6" />, color: "from-emerald-500 to-emerald-700" },
                { label: "Avg Attendance", value: `${report.summary.avgAttendancePercentage}%`, icon: <Percent className="w-6 h-6" />, color: "from-violet-500 to-violet-700" },
                { label: "Working Days", value: report.totalWorkingDays, icon: <Calendar className="w-6 h-6" />, color: "from-amber-500 to-amber-700" },
              ].map((s) => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 shadow-lg text-white relative overflow-hidden`}>
                  <div className="absolute top-3 right-3 opacity-20">{React.cloneElement(s.icon as React.ReactElement, { className: "w-12 h-12" })}</div>
                  <div className="text-3xl font-black">{s.value}</div>
                  <div className="text-sm font-medium opacity-80 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Daily Hours Chart */}
            {report.dailyBreakdown.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h2 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" /> Daily Hours & Workforce
                </h2>
                <p className="text-sm text-gray-500 mb-4">Hours worked per day and number of active workers</p>
                <div className="overflow-x-auto">
                  <div className="flex items-end gap-1 min-w-[500px]" style={{ height: 200 }}>
                    {report.dailyBreakdown.map((d) => {
                      const hPct = (d.totalHours / maxDailyHours) * 100;
                      const dayNum = new Date(d.date).getDate();
                      const dayName = new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" });
                      return (
                        <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative" style={{ minWidth: 18 }}>
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                            <div className="font-bold">{new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                            <div>{d.totalHours.toFixed(1)} hrs · {d.workerCount} workers</div>
                          </div>
                          <div
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-300 hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                            style={{ height: `${Math.max(hPct, 2)}%`, minHeight: 4 }}
                          />
                          <div className="text-[10px] text-gray-400 mt-1 leading-none">{dayNum}</div>
                          <div className="text-[8px] text-gray-300 leading-none">{dayName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-gradient-to-t from-blue-600 to-blue-400" /> Hours Worked</div>
                  <div>Total: <span className="font-bold text-gray-900">{report.summary.totalHoursWorked.toFixed(1)} hrs</span></div>
                </div>
              </div>
            )}

            {/* Attendance Donut */}
            {report.performance.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Donut chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-violet-600" /> Attendance Distribution
                  </h3>
                  <div className="flex items-center justify-center">
                    <AttendanceDonut performance={report.performance} />
                  </div>
                </div>

                {/* Top Performers */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" /> Top Performers
                  </h3>
                  <div className="space-y-3">
                    {sorted.slice(0, 5).map((p, i) => (
                      <div key={p.applicantId} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-500"}`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">{p.fullName}</div>
                          <div className="text-xs text-gray-500">{p.city || "—"}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-900 text-sm">{p.totalHours} hrs</div>
                          <div className="text-xs text-gray-500">{p.daysWorked} days</div>
                        </div>
                        <div className="w-20">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(p.attendancePercentage, 100)}%` }} />
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5 text-right">{p.attendancePercentage}%</div>
                        </div>
                      </div>
                    ))}
                    {sorted.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No attendance data for this month</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Performance Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" /> Detailed Performance
                </h2>
                <span className="text-sm text-gray-500">{sorted.length} employee{sorted.length !== 1 ? "s" : ""}</span>
              </div>

              {sorted.length === 0 ? (
                <div className="py-16 text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="font-medium text-gray-700">No performance data</p>
                  <p className="text-sm mt-1">Record attendance to see reports here</p>
                </div>
              ) : (
                <>
                  {/* Mobile cards */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {sorted.map((p) => (
                      <div key={p.applicantId} className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="font-semibold text-gray-900">{p.fullName}</div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.attendancePercentage >= 80 ? "bg-green-100 text-green-700" : p.attendancePercentage >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                            {p.attendancePercentage}%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div><span className="text-gray-500 text-xs">Hours</span><div className="font-bold text-blue-900">{p.totalHours ?? 0}</div></div>
                          <div><span className="text-gray-500 text-xs">Days</span><div className="font-bold">{p.daysWorked ?? 0}</div></div>
                          <div><span className="text-gray-500 text-xs">Avg/Day</span><div className="font-bold">{p.avgHoursPerDay ?? 0}</div></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop table */}
                  <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-left min-w-[800px]">
                      <thead>
                        <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                          <th className="px-4 py-3 font-semibold">Employee</th>
                          <th className="px-4 py-3 font-semibold cursor-pointer hover:text-blue-900 select-none" onClick={() => toggleSort("totalHours")}>
                            Total Hours {sortField === "totalHours" && (sortDir === "desc" ? "↓" : "↑")}
                          </th>
                          <th className="px-4 py-3 font-semibold cursor-pointer hover:text-blue-900 select-none" onClick={() => toggleSort("daysWorked")}>
                            Days Worked {sortField === "daysWorked" && (sortDir === "desc" ? "↓" : "↑")}
                          </th>
                          <th className="px-4 py-3 font-semibold cursor-pointer hover:text-blue-900 select-none" onClick={() => toggleSort("avgHoursPerDay")}>
                            Avg Hrs/Day {sortField === "avgHoursPerDay" && (sortDir === "desc" ? "↓" : "↑")}
                          </th>
                          <th className="px-4 py-3 font-semibold">Min / Max</th>
                          <th className="px-4 py-3 font-semibold cursor-pointer hover:text-blue-900 select-none" onClick={() => toggleSort("attendancePercentage")}>
                            Attendance {sortField === "attendancePercentage" && (sortDir === "desc" ? "↓" : "↑")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {sorted.map((p) => (
                          <tr key={p.applicantId} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-gray-900 text-sm">{p.fullName}</div>
                              <div className="text-xs text-gray-400">{p.phoneNumber} · {p.city || "—"}</div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-bold text-blue-900 text-lg">{p.totalHours}</span>
                              <span className="text-xs text-gray-400 ml-1">hrs</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-bold text-gray-900">{p.daysWorked}</span>
                              <span className="text-xs text-gray-400 ml-1">/ {report.totalWorkingDays}</span>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-gray-700">{p.avgHoursPerDay ?? 0} hrs</td>
                            <td className="px-4 py-3.5 text-sm text-gray-600">{p.minHoursInDay ?? 0} / {p.maxHoursInDay ?? 0} hrs</td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${p.attendancePercentage >= 80 ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : p.attendancePercentage >= 50 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" : "bg-gradient-to-r from-red-400 to-red-600"}`}
                                    style={{ width: `${Math.min(p.attendancePercentage, 100)}%` }}
                                  />
                                </div>
                                <span className={`text-sm font-bold ${p.attendancePercentage >= 80 ? "text-emerald-700" : p.attendancePercentage >= 50 ? "text-yellow-700" : "text-red-700"}`}>
                                  {p.attendancePercentage}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </>
        ) : null}
      </main>

      <footer className="text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} UTTAM Business Consultancy · Admin Reports
      </footer>
    </div>
  );
}

/* ── Attendance Donut Component ── */
function AttendanceDonut({ performance }: { performance: PerformanceRow[] }) {
  const excellent = performance.filter(p => p.attendancePercentage >= 80).length;
  const good = performance.filter(p => p.attendancePercentage >= 50 && p.attendancePercentage < 80).length;
  const poor = performance.filter(p => p.attendancePercentage < 50).length;
  const total = performance.length || 1;

  const segments = [
    { label: "≥80%", count: excellent, color: "#10b981", pct: (excellent / total) * 100 },
    { label: "50-79%", count: good, color: "#f59e0b", pct: (good / total) * 100 },
    { label: "<50%", count: poor, color: "#ef4444", pct: (poor / total) * 100 },
  ];

  // Build conic-gradient
  let gradientParts: string[] = [];
  let cumulative = 0;
  for (const seg of segments) {
    if (seg.pct > 0) {
      gradientParts.push(`${seg.color} ${cumulative}% ${cumulative + seg.pct}%`);
      cumulative += seg.pct;
    }
  }
  if (gradientParts.length === 0) gradientParts.push("#e5e7eb 0% 100%");
  const gradient = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-36 h-36">
        <div className="w-full h-full rounded-full" style={{ background: gradient }} />
        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-black text-gray-900">{performance.length}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wide">Employees</div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 text-xs">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-gray-600">{s.label}: <b>{s.count}</b></span>
          </div>
        ))}
      </div>
    </div>
  );
}
