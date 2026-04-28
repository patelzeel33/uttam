import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import Logo from "../components/Logo";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data: any = {};
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try { data = await res.json(); } catch { /* empty body */ }
      }

      if (!res.ok) {
        throw new Error(data?.error || `Server error (${res.status}). Please try again.`);
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_email', data.admin.email);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400 rounded-full opacity-5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-900 px-8 pt-10 pb-8 text-center">
            <div className="flex justify-center mb-4">
              <Logo className="w-20 h-auto" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal</h1>
            <p className="text-blue-300 text-sm mt-1">UTTAM Business Consultancy</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 border border-red-100 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-900" /> Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@uttam.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-900" /> Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In…
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/" className="text-sm text-blue-700 hover:text-blue-900 transition-colors">
                ← Back to Homepage
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-blue-300/60 text-xs mt-6">
          © {new Date().getFullYear()} UTTAM Business Consultancy. Secure Admin Access.
        </p>
      </div>
    </div>
  );
}
