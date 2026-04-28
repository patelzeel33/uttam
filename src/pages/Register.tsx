import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle2, AlertCircle, ChevronLeft, Building, MapPin, Phone, User, Mail } from "lucide-react";
import Logo from "../components/Logo";

export default function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    experience: "none"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 border border-gray-100">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Application Submitted!</h1>
                <p className="text-gray-600">
                    Thank you, {formData.fullName}. We have received your application for the Delivery Partner role. 
                    Our recruitment team will contact you shortly on <strong>{formData.phoneNumber}</strong>.
                </p>
                <div className="pt-4">
                     <Link to="/" className="inline-block bg-blue-900 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-800 transition-colors">
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
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-blue-900 flex items-center gap-1 hover:text-blue-700 font-medium">
            <ChevronLeft className="w-5 h-5"/> Back
          </Link>
          <div className="flex items-center">
            <Logo className="w-14 h-auto" />
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 py-10">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-blue-900 text-white p-8 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-blue-800 opacity-50 transform -skew-y-3 origin-bottom-left -z-0"></div>
                 <div className="relative z-10 space-y-2">
                    <h1 className="text-3xl font-black italic tracking-tight">JOIN UTTAM TODAY</h1>
                    <p className="text-blue-200">Apply for Delivery Partner • Full-Time • Direct Payroll</p>
                 </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Submission Failed</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                             <User className="w-4 h-4 text-blue-900"/> Full Name *
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
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-900"/> Phone Number *
                        </label>
                        <input 
                            type="tel" 
                            name="phoneNumber"
                            required
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-900"/> Email Address
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

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-blue-900"/> Full Address *
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

                <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                    <p className="text-xs text-gray-500 max-w-xs">
                        By applying, you agree to join under direct company payroll.
                    </p>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full transition-all shadow-md flex items-center justify-center min-w-[160px] border border-yellow-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
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
