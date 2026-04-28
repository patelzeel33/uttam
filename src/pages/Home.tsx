import { useState, useEffect } from "react";
import { Link } from "react-router";
import Logo from "../components/Logo";
import { 
  Bike, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Wallet, 
  Clock, 
  Briefcase, 
  Heart,
  ShoppingCart,
  Zap,
  Coffee,
  Package,
  TrendingUp,
  Shield,
  Megaphone,
  ChevronRight,
  X
} from "lucide-react";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show immediately on first load
    setShowPopup(true);

    // Show repeatedly every 1 minute
    const interval = setInterval(() => {
      setShowPopup(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo className="w-14 sm:w-16" />
          </div>
          <Link 
            to="/register" 
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-full transition-colors flex items-center gap-1 shadow-sm uppercase tracking-wide text-sm sm:text-base border border-yellow-500"
          >
            Apply Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        
        {/* WE ARE HIRING HEADER & POSITION CARD */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-6 sm:p-10 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
          
          <div className="space-y-6 relative z-10">
            <div>
              <h2 className="text-gray-600 font-semibold tracking-wider uppercase mb-1">We Are</h2>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-blue-900 italic tracking-tighter leading-none mb-4" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                HIRING<span className="text-yellow-400">!</span>
              </h1>
              <div className="inline-block bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded-md transform -skew-x-12 shadow-sm border border-yellow-500">
                <span className="inline-block transform skew-x-12">
                  Join UTTAM | Direct Company Payroll
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-70 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-900 text-white p-3 rounded-full shrink-0 flex items-center justify-center">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-blue-900 font-bold text-lg">Position</h3>
                  <p className="text-gray-800 font-semibold">Delivery Partner / Rider</p>
                  <p className="text-sm text-gray-500">Direct Company Payroll | Full-Time</p>
                </div>
              </div>

              <div className="h-px bg-blue-200"></div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-900 text-white p-3 rounded-full shrink-0 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-blue-900 font-bold text-lg">Location</h3>
                  <p className="text-gray-800 font-semibold">Thaltej -Naroda -Ahmedabad</p>
                </div>
              </div>

              <div className="h-px bg-blue-200"></div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-900 text-white p-3 rounded-full shrink-0 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-blue-900 font-bold text-lg">No. of Openings</h3>
                  <p className="text-gray-800 font-semibold text-xl">2000 Riders</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end relative h-full min-h-[300px]">
            <div className="absolute inset-0 bg-blue-900 rounded-3xl transform rotate-3 flex items-center justify-center p-8 overflow-hidden z-0">
               <div className="w-full text-center space-y-6 flex flex-col items-center">
                 <div className="text-yellow-400 font-bold text-2xl flex items-center gap-2">
                   <Shield className="w-8 h-8"/> Ethical Corporate Culture
                 </div>
                 <div className="text-white text-lg">Stable & Secure Job</div>
                 <div className="text-white text-lg">Career Growth Opportunities</div>
                 <div className="text-white text-lg font-semibold bg-white/10 px-6 py-3 rounded-full border border-white/20">Fixed Monthly Income</div>
                 
                 <div className="mt-8 flex justify-center space-x-4">
                   <div className="text-white flex flex-col items-center">
                     <CheckCircle2 className="w-8 h-8 text-yellow-400 mb-1" />
                     <span className="text-xs">Direct Payroll</span>
                   </div>
                   <div className="text-white flex flex-col items-center">
                     <Wallet className="w-8 h-8 text-yellow-400 mb-1" />
                     <span className="text-xs">Fixed Income</span>
                   </div>
                   <div className="text-white flex flex-col items-center">
                     <TrendingUp className="w-8 h-8 text-yellow-400 mb-1" />
                     <span className="text-xs">Growth</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Salary & Work Structure */}
          <section className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-blue-900 flex items-center px-6 py-4">
               <Wallet className="text-yellow-400 w-6 h-6 mr-3" />
               <h2 className="text-white font-bold text-lg tracking-wide uppercase">Salary & Work Structure</h2>
            </div>
            <div className="p-6 space-y-4 text-gray-700">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-700 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <div><strong className="text-gray-900 text-base">Fixed Salary:</strong> <span className="text-blue-800 font-semibold bg-blue-50 px-2 py-0.5 rounded">Earn up to 30,000/-</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-700 p-1 rounded-full shrink-0 mt-0.5"><Clock className="w-4 h-4"/></div>
                  <div><strong className="text-gray-900 text-base">Login Hours:</strong> <span className="text-blue-800 font-semibold">10 hours per day (Required)</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-700 p-1 rounded-full shrink-0 mt-0.5"><Briefcase className="w-4 h-4"/></div>
                  <div><strong className="text-gray-900">Fixed Working Hours as per Government Compliances</strong></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-700 p-1 rounded-full shrink-0 mt-0.5"><TrendingUp className="w-4 h-4"/></div>
                  <div><strong className="text-gray-900">Overtime Incentives Available</strong></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-700 p-1 rounded-full shrink-0 mt-0.5"><Shield className="w-4 h-4"/></div>
                  <div><strong className="text-gray-900">No hidden deductions like freelance/Gig model</strong></div>
                </li>
              </ul>
            </div>
          </section>

          {/* Why Join UTTAM */}
          <section className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-yellow-400 flex items-center px-6 py-4">
               <Heart className="text-blue-900 w-6 h-6 mr-3 fill-current" />
               <h2 className="text-blue-900 font-bold text-lg tracking-wide uppercase">Why Join UTTAM</h2>
            </div>
            <div className="p-6 text-gray-700 h-full bg-blue-50/50">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-yellow-400 text-blue-900 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <span className="font-medium text-gray-800 text-lg">Stable & Secure Job</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-yellow-400 text-blue-900 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <span className="font-medium text-gray-800 text-lg">Fixed Monthly Income</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-yellow-400 text-blue-900 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <span className="font-medium text-gray-800 text-lg">Career Growth Opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-yellow-400 text-blue-900 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <span className="font-medium text-gray-800 text-lg">Promotion & Performance Incentives</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-yellow-400 text-blue-900 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <span className="font-medium text-gray-800 text-lg">Ethical Corporate Culture</span>
                </li>
              </ul>
            </div>
          </section>

        </div>

        {/* THREE COLUMNS: Work Scope / What we Provide / Employee Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Work Scope */}
          <div className="bg-white border hover:border-blue-300 transition-colors rounded-2xl p-6 shadow-sm flex flex-col group">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-green-100 text-green-600 p-4 rounded-full mb-3 group-hover:-translate-y-2 transition-transform">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h3 className="text-blue-900 font-bold uppercase tracking-wide">Work Scope</h3>
            </div>
            <ul className="space-y-4 text-gray-700 flex-grow">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/> Quick Commerce</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/> E-Commerce</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/> Food Delivery:</li>
              <li className="text-sm font-medium pl-6 text-gray-600 leading-relaxed border-l-2 border-green-200 ml-2 mt-2 pt-1 pb-1">
                <span className="text-green-700">Zepto</span>, <span className="text-orange-500">blinkit</span>, <br/>
                <span className="text-red-500">big basket</span>, <br/>
                <span className="text-blue-600">Flipkart minutes</span> <br/>
                & Amazon
              </li>
            </ul>
          </div>

          {/* What We Provide */}
          <div className="bg-white border hover:border-blue-300 transition-colors rounded-2xl p-6 shadow-sm flex flex-col group">
             <div className="flex flex-col items-center mb-6">
              <div className="bg-blue-100 text-blue-900 p-4 rounded-full mb-3 group-hover:-translate-y-2 transition-transform">
                <Bike className="w-8 h-8" />
              </div>
              <h3 className="text-blue-900 font-bold uppercase tracking-wide">What We Provide</h3>
            </div>
            <ul className="space-y-4 text-gray-700 flex-grow">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5"/> 
                <span><span className="font-semibold text-gray-900">Company-Provided</span> EV Vehicles</span>
              </li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0"/> No Fuel Cost</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0"/> No Maintenance Charges</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0"/> No Order Pressure Policy</li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5"/> 
                <span>Corporate & Ethical Work Environment</span>
              </li>
            </ul>
          </div>

          {/* Employee Benefits */}
          <div className="bg-white border hover:border-blue-300 transition-colors rounded-2xl p-6 shadow-sm flex flex-col group relative overflow-hidden">
             
            <div className="flex flex-col items-center mb-6 relative z-10">
              <div className="bg-red-100 text-red-600 p-4 rounded-full mb-3 group-hover:-translate-y-2 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-blue-900 font-bold uppercase tracking-wide">Employee Benefits</h3>
            </div>
            <ul className="space-y-4 text-gray-700 flex-grow relative z-10">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0"/> Provident Fund (PF)</li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5"/> 
                <span>Mediclaim / Insurance Cover</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5"/> 
                <span><span className="font-semibold text-gray-900">Loan Guarantee</span><br/><span className="text-sm">(on long-term service)</span></span>
              </li>
              <li className="flex items-start gap-2">
                 <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5"/> 
                 <span>Partial Accommodation Support</span>
              </li>
              <li className="flex items-start gap-2 font-medium">
                 <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5"/> 
                 <span className="text-blue-900">Vehicle Ownership Option after 36 Months of Service</span>
              </li>
            </ul>
          </div>

        </div>

        {/* APPLY NOW BANNER */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden flex flex-col sm:flex-row items-center justify-between shadow-lg">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          
          <div className="z-10 flex flex-col sm:flex-row items-center gap-6 mb-6 sm:mb-0">
            <div className="bg-white p-4 rounded-full shadow-lg transform -rotate-12">
              <Megaphone className="w-10 h-10 text-yellow-500" />
            </div>
             <div className="text-left">
              <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight uppercase mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                APPLY NOW
              </h2>
              <div className="inline-block bg-yellow-400 text-blue-900 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider transform -skew-x-12 border border-yellow-500">
                <span className="inline-block transform skew-x-12">Limited Positions Available!</span>
              </div>
            </div>
          </div>
          
          <Link 
            to="/register" 
            className="z-10 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-10 rounded-full text-lg sm:text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 uppercase tracking-wide border-2 border-yellow-300 ring-4 ring-blue-900/10 flex items-center gap-2"
          >
            Register Today <ChevronRight className="w-6 h-6"/>
          </Link>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-200 py-8 text-center text-sm border-t border-blue-900">
        <p className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} UTTAM Business Consultancy. All rights reserved. <Link to="/admin" className="hover:text-white transition-colors">Direct Company Payroll</Link> Recruitment.
        </p>
      </footer>

      {/* Promotional Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm transition-opacity">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setShowPopup(false)}></div>
          
          <div className="bg-white rounded-2xl relative w-full max-w-md md:max-w-lg lg:max-w-xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md z-20 transition-colors border border-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="overflow-y-auto flex-grow flex flex-col relative bg-blue-50">
              <img 
                src="/bonus-banner.jpg" 
                alt="Summer Bonus MELA" 
                className="w-full h-auto min-h-[300px] object-contain object-top"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  document.getElementById('fallback-banner')?.classList.remove('hidden');
                  document.getElementById('fallback-banner')?.classList.add('flex');
                }}
              />
              <div id="fallback-banner" className="hidden flex-col items-center justify-center p-8 text-center space-y-4 bg-gradient-to-b from-blue-50 to-white min-h-[400px]">
                  <div className="bg-yellow-400 text-blue-900 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wider mb-2 animate-pulse">Missing Image</div>
                  <h3 className="text-4xl font-black text-blue-900 italic uppercase leading-none">Summer Bonus<br/>Mela</h3>
                  <p className="font-black text-red-600 text-3xl">₹12,000 <span className="text-xl">Bonus</span></p>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 mt-4 max-w-sm text-left">
                    <p className="text-gray-700 text-sm">
                      <strong className="text-orange-500 block mb-1">Action Required:</strong>
                      In the code editor's file panel, click the <b>Upload File</b> button (cloud icon with up arrow), select your image, and rename it to <strong className="text-blue-600 font-mono bg-blue-50 px-1">bonus-banner.jpg</strong>. Move it to the <b>public</b> folder.
                    </p>
                  </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-5 bg-white border-t border-gray-200 flex-shrink-0 flex justify-center sticky bottom-0 z-10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
              <Link 
                to="/register"
                onClick={() => setShowPopup(false)}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-black py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] uppercase tracking-wider border border-yellow-500 w-full text-center text-lg flex items-center justify-center gap-2"
              >
                Apply Now & Claim Bonus <ChevronRight className="w-5 h-5"/>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
