import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ChevronLeft, Copy, Check, Users, Gift, Calendar,
  Search, Loader2, AlertCircle, UserCheck, Trophy, Share2
} from "lucide-react";
import Logo from "../components/Logo";

interface ReferredUser {
  id: string;
  fullName: string;
  joinDate: string;
  status: string;
}

interface ReferralData {
  user: {
    id: string;
    fullName: string;
    referral_code: string;
    ridersReferred: number;
    status: string;
    submittedAt: string;
  };
  referredBy: { fullName: string; referral_code: string } | null;
  referredUsers: ReferredUser[];
  totalReferred: number;
}

export default function MyReferrals() {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [code, setCode] = useState(initialCode);
  const [inputCode, setInputCode] = useState(initialCode);
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchReferralInfo = async (referralCode: string) => {
    if (!referralCode.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/referral-info?code=${encodeURIComponent(referralCode.trim().toUpperCase())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch referral info.");
      setData(json);
      setCode(referralCode.trim().toUpperCase());
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchReferralInfo(initialCode);
    }
  }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async (referralCode: string) => {
    const shareText = `Join UTTAM as a Delivery Partner! Use my referral code: ${referralCode} when you register at ${window.location.origin}/register`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "UTTAM Referral", text: shareText });
      } catch { /* user cancelled */ }
    } else {
      handleCopy(shareText);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReferralInfo(inputCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <Link to="/" className="text-blue-900 flex items-center gap-1 hover:text-blue-700 active:text-blue-950 font-medium text-sm sm:text-base">
            <ChevronLeft className="w-5 h-5" /> Home
          </Link>
          <div className="flex items-center">
            <Logo className="w-12 sm:w-14 h-auto" />
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-6 sm:py-10 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" /> Referral Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">My Referrals</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Track your referrals and see who joined using your code.
          </p>
        </div>

        {/* Lookup Form */}
        {!data && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 animate-fade-in-up">
            <form onSubmit={handleLookup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-900" /> Enter Your Referral Code
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                    placeholder="e.g. DB1023"
                    required
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all font-mono tracking-wider text-blue-900 text-lg placeholder:text-gray-300 placeholder:font-sans placeholder:text-base placeholder:tracking-normal"
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputCode.trim()}
                    className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    <span className="hidden sm:inline">Look Up</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2.5 border border-red-100 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin" />
          </div>
        )}

        {/* Dashboard Content */}
        {data && !loading && (
          <div className="space-y-5 animate-fade-in-up">
            {/* Profile + Referral Code Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">Welcome back</p>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">{data.user.fullName}</h2>
                    <p className="text-blue-300 text-sm mt-1">
                      Joined {new Date(data.user.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wide ${
                    data.user.status === "active" ? "bg-green-400/20 text-green-300" :
                    data.user.status === "rejected" ? "bg-red-400/20 text-red-300" :
                    data.user.status === "interview" ? "bg-yellow-400/20 text-yellow-300" :
                    "bg-white/15 text-white"
                  }`}>
                    {data.user.status}
                  </span>
                </div>

                {/* Referral Code Display */}
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/10">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">Your Referral Code</p>
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-3xl sm:text-4xl font-mono font-black text-white tracking-[0.2em]">
                      {data.user.referral_code}
                    </code>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(data.user.referral_code)}
                        className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all"
                        title="Copy code"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleShare(data.user.referral_code)}
                        className="p-2.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 transition-all"
                        title="Share code"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 divide-x divide-gray-100">
                <div className="p-5 sm:p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-3xl font-black text-blue-900">{data.totalReferred}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">People Referred</p>
                </div>
                <div className="p-5 sm:p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-3xl font-black text-blue-900">
                      {data.totalReferred >= 10 ? "🌟" : data.totalReferred >= 5 ? "⭐" : "🔵"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {data.totalReferred >= 10 ? "Star Referrer" : data.totalReferred >= 5 ? "Top Referrer" : "Active Referrer"}
                  </p>
                </div>
              </div>
            </div>

            {/* Referred By Info */}
            {data.referredBy && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium">Referred by</p>
                  <p className="text-sm font-bold text-blue-900">{data.referredBy.fullName} <span className="text-blue-500 font-mono text-xs">({data.referredBy.referral_code})</span></p>
                </div>
              </div>
            )}

            {/* Referred Users List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-900" />
                  <h3 className="font-bold text-gray-900">Referred Users</h3>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  {data.totalReferred} total
                </span>
              </div>

              {data.referredUsers.length === 0 ? (
                <div className="p-8 sm:p-12 text-center text-gray-500">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="font-medium text-gray-700 text-lg">No referrals yet</p>
                  <p className="text-sm mt-1 max-w-xs mx-auto">
                    Share your referral code <span className="font-mono font-bold text-blue-700">{data.user.referral_code}</span> with friends to get started!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {data.referredUsers.map((user, index) => (
                    <div key={user.id} className="px-5 py-4 flex items-center justify-between hover:bg-blue-50/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{user.fullName}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(user.joinDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                        user.status === "active" ? "bg-green-100 text-green-700" :
                        user.status === "rejected" ? "bg-red-100 text-red-700" :
                        user.status === "interview" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Back / New Lookup */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => { setData(null); setCode(""); setInputCode(""); setError(null); }}
                className="text-sm text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors"
              >
                Look up a different code
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
