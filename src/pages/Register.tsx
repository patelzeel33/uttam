import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle2, AlertCircle, ChevronLeft, MapPin, Phone, User, Mail, Copy, Check, Gift } from "lucide-react";
import Logo from "../components/Logo";

export default function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [referralCodeGenerated, setReferralCodeGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    experience: "none",
    referralCode: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Safely parse response — empty 500 bodies cause SyntaxError with .json()
      let data: any = {};
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try { data = await response.json(); } catch { /* empty body */ }
      }

      if (!response.ok) {
        throw new Error(data?.error || `Server error (${response.status}). Please try again.`);
      }

      if (data?.applicationId) {
        setApplicationId(data.applicationId);
      }
      if (data?.referral_code) {
        setReferralCodeGenerated(data.referral_code);
      }
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl max-w-md w-full text-center space-y-5 sm:space-y-6 border border-gray-100 animate-fade-in-up">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Application Submitted!</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Thank you, {formData.fullName}. We have received your application for the Delivery Partner role.
            Our recruitment team will contact you shortly on <strong>{formData.phoneNumber}</strong>.
          </p>

          {/* Referral Code Card */}
          {referralCodeGenerated && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-2xl mt-2 animate-fade-in-up">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Gift className="w-5 h-5 text-blue-700" />
                <p className="text-sm text-blue-900 font-bold">Your Unique Referral Code</p>
              </div>
              <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-blue-100 shadow-sm">
                <code className="text-2xl font-mono font-black text-blue-700 tracking-widest">
                  {referralCodeGenerated}
                </code>
                <button
                  onClick={() => handleCopy(referralCodeGenerated)}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                  title="Copy referral code"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-blue-700 mt-3 leading-relaxed">
                Share this code with friends! When they register using your code, you'll earn referral credit.
              </p>
              <Link
                to={`/my-referrals?code=${referralCodeGenerated}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800 hover:text-blue-950 mt-3 underline underline-offset-2 decoration-blue-300 hover:decoration-blue-600 transition-colors"
              >
                View Your Referral Dashboard →
              </Link>
            </div>
          )}

          <div className="pt-2 sm:pt-4">
            <Link to="/" className="inline-block w-full sm:w-auto bg-blue-900 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-800 active:bg-blue-950 transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <Link to="/" className="text-blue-900 flex items-center gap-1 hover:text-blue-700 active:text-blue-950 font-medium text-sm sm:text-base">
            <ChevronLeft className="w-5 h-5" /> Back
          </Link>
          <div className="flex items-center">
            <Logo className="w-12 sm:w-14 h-auto" />
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-start sm:items-center justify-center p-3 sm:p-4 py-4 sm:py-10">
        <div className="max-w-2xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-blue-900 text-white p-5 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-800 opacity-50 transform -skew-y-3 origin-bottom-left -z-0"></div>
            <div className="relative z-10 space-y-1.5 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight">JOIN UTTAM TODAY</h1>
              <p className="text-blue-200 text-xs sm:text-base">Apply for Delivery Partner • Full-Time • Direct Payroll</p>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-6">

            {error && (
              <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-xl flex items-start gap-2.5 sm:gap-3 border border-red-100 animate-fade-in-up">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">Submission Failed</p>
                  <p className="text-xs sm:text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-900" /> Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-900" /> Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phoneNumber: val });
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                  placeholder="10-digit number"
                />
                {formData.phoneNumber.length > 0 && formData.phoneNumber.length < 10 && (
                  <p className="text-xs text-amber-600 ml-1">{formData.phoneNumber.length}/10 digits entered</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-900" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-900" /> Full Address *
              </label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all resize-none"
                placeholder="Enter your current residential address"
              ></textarea>
            </div>

            {/* Referral Code Field - Premium styled */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                <Gift className="w-4 h-4 text-blue-900" /> Referral Code <span className="text-xs text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                    setFormData({ ...formData, referralCode: val });
                  }}
                  className="w-full bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-mono tracking-wider text-blue-900 placeholder:text-blue-300 placeholder:font-sans placeholder:tracking-normal"
                  placeholder="e.g. DB1023"
                />
              </div>
              <p className="text-xs text-gray-500 ml-1">
                Were you referred by someone? Enter their referral code here.
              </p>
            </div>

            <div className="pt-3 sm:pt-4 mt-4 sm:mt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <p className="text-xs text-gray-500 max-w-xs text-center sm:text-left">
                By applying, you agree to join under direct company payroll.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-blue-900 font-bold py-3.5 sm:py-3 px-8 rounded-full transition-all shadow-md flex items-center justify-center min-w-[160px] border border-yellow-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-95 sm:hover:scale-105'}`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'SUBMIT APPLICATION'
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
