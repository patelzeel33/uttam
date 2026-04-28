import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, RefreshCw, Trash2, Download, Settings, X, PlusCircle } from "lucide-react";
import Logo from "../components/Logo";

export default function Admin() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for Manage Model
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [addHoursStatus, setAddHoursStatus] = useState<string>('');

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = (import.meta as any).env.VITE_APP_URL ? `${(import.meta as any).env.VITE_APP_URL}/api/applications` : '/api/applications';
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      // Sort by newest first
      setApplications(data.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setUpdateLoading(true);
    try {
      const apiUrl = (import.meta as any).env.VITE_APP_URL ? `${(import.meta as any).env.VITE_APP_URL}/api/applications/${selectedUser.id}` : `/api/applications/${selectedUser.id}`;
      
      let newTotalHours = Number(selectedUser.hoursLogged || 0);
      if (addHoursStatus !== '') {
         newTotalHours += Number(addHoursStatus);
      }

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedUser.status,
          hoursLogged: newTotalHours
        })
      });

      if (!response.ok) throw new Error('Failed to update application');
      
      // Reset form variables and refresh
      setAddHoursStatus('');
      setSelectedUser(null);
      await fetchApplications();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleExport = () => {
    if (applications.length === 0) return;
    
    const headers = ['Full Name', 'Phone', 'Email', 'Address', 'Status', 'Hours Logged', 'Submitted At'];
    const csvContent = [
      headers.join(','),
      ...applications.map(app => [
        `"${app.fullName || ''}"`,
        `"${app.phoneNumber || ''}"`,
        `"${app.email || ''}"`,
        `"${app.address || ''}"`,
        `"${app.status || 'pending'}"`,
        `"${app.hoursLogged || 0}"`,
        `"${new Date(app.submittedAt).toLocaleString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-blue-900 flex items-center gap-1 hover:text-blue-700 font-medium">
            <ChevronLeft className="w-5 h-5"/> Back
          </Link>
          <div className="flex items-center gap-4">
             <h1 className="font-bold text-gray-800 text-lg sm:text-xl">Admin Dashboard</h1>
             <Logo className="w-10 h-auto" />
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 relative">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-blue-900">Received Applications</h2>
              <p className="text-gray-500 text-sm">Total Applications: <span className="font-semibold text-gray-900">{applications.length}</span></p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={fetchApplications}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
              <button 
                onClick={handleExport}
                disabled={applications.length === 0}
                className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600 bg-red-50">
                <p>Error loading applications: {error}</p>
                <button onClick={fetchApplications} className="mt-4 underline hover:text-red-800">Try Again</button>
              </div>
            ) : applications.length === 0 ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <Inbox className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900">No applications yet</p>
                <p>When users apply, their details will appear here.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm border-b border-gray-200">
                    <th className="p-4 font-semibold">Applicant</th>
                    <th className="p-4 font-semibold">Contact</th>
                    <th className="p-4 font-semibold">Address</th>
                    <th className="p-4 font-semibold text-center">Status</th>
                    <th className="p-4 font-semibold text-center">Total Hours</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{app.fullName}</div>
                        <div className="text-xs text-gray-500">ID: {app.id.slice(-6)}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{app.phoneNumber}</div>
                          {app.email && <div className="text-gray-500">{app.email}</div>}
                        </div>
                      </td>
                      <td className="p-4 max-w-[200px]">
                        <div className="text-sm text-gray-600 truncate" title={app.address}>
                          {app.address}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wide
                          ${app.status === 'active' ? 'bg-green-100 text-green-700' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            app.status === 'interview' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'}`}>
                          {app.status || 'pending'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                         <div className="font-bold text-blue-900 text-lg">{app.hoursLogged || 0}</div>
                         <div className="text-[10px] text-gray-500 uppercase">hours</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-500">
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                          <button 
                            onClick={() => setSelectedUser({...app})}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-2 rounded-lg transition-colors border border-blue-200 flex items-center justify-center gap-1 ml-auto text-sm font-medium"
                          >
                            <Settings className="w-4 h-4"/> Manage
                          </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* MANAGE USER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
               <div>
                  <h3 className="font-bold text-lg">Manage Employee</h3>
                  <p className="text-blue-200 text-sm">{selectedUser.fullName}</p>
               </div>
               <button onClick={() => { setSelectedUser(null); setAddHoursStatus(''); }} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5"/>
               </button>
            </div>

            <div className="p-6 overflow-y-auto w-full">
               <form id="manage-form" onSubmit={handleUpdateUser} className="space-y-6">
                 
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Application Status</label>
                    <select 
                      value={selectedUser.status}
                      onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all font-medium text-gray-900"
                    >
                      <option value="pending">Pending</option>
                      <option value="interview">Interview Stage</option>
                      <option value="active">Active (Hired)</option>
                      <option value="rejected">Rejected</option>
                    </select>
                 </div>

                 <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-sm font-bold text-blue-900 uppercase tracking-wide">Work Hours</label>
                       <div className="text-xs font-semibold bg-white px-2 py-1 rounded text-blue-800 shadow-sm">
                          Total Logged: {selectedUser.hoursLogged || 0} hrs
                       </div>
                    </div>
                    
                    <div className="space-y-2 relative">
                        <label className="text-xs text-gray-600">Add New Hours (optional)</label>
                        <div className="relative flex items-center">
                          <PlusCircle className="absolute left-3 text-blue-500 w-5 h-5"/>
                          <input 
                            type="number" 
                            min="0"
                            step="0.5"
                            value={addHoursStatus}
                            onChange={(e) => setAddHoursStatus(e.target.value)}
                            placeholder="e.g. 8.5"
                            className="w-full bg-white border border-blue-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                          />
                        </div>
                    </div>
                 </div>

               </form>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
               <button 
                  onClick={() => { setSelectedUser(null); setAddHoursStatus(''); }}
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
                 {updateLoading && <RefreshCw className="w-4 h-4 animate-spin"/>}
                 Save Changes
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const Inbox = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)
