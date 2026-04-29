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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo className="w-12 sm:w-16" />
          </div>
          <Link 
            to="/register" 
            className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-blue-900 font-bold py-2 px-4 sm:px-6 rounded-full transition-colors flex items-center gap-1 shadow-sm uppercase tracking-wide text-xs sm:text-base border border-yellow-500"
          >
            Apply Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-8 w-full">
        
        {/* WE ARE HIRING HEADER & POSITION CARD */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-center bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-4 sm:p-10 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
          
          <div className="space-y-4 sm:space-y-6 relative z-10">
            <div>
              <h2 className="text-gray-600 font-semibold tracking-wider uppercase mb-1 text-sm sm:text-base">We Are</h2>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-blue-900 italic tracking-tighter leading-none mb-3 sm:mb-4" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                HIRING<span className="text-yellow-400">!</span>
              </h1>
              <div className="inline-block bg-yellow-400 text-blue-900 font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transform -skew-x-12 shadow-sm border border-yellow-500 text-sm sm:text-base">
                <span className="inline-block transform skew-x-12">
                  Join UTTAM | Direct Company Payroll
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-70 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-blue-900 text-white p-2.5 sm:p-3 rounded-full shrink-0 flex items-center justify-center">
                  <Bike className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-blue-900 font-bold text-base sm:text-lg">Position</h3>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">Delivery Partner / Rider</p>
                  <p className="text-xs sm:text-sm text-gray-500">Direct Company Payroll | Full-Time</p>
                </div>
              </div>

              <div className="h-px bg-blue-200"></div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-blue-900 text-white p-2.5 sm:p-3 rounded-full shrink-0 flex items-center justify-center">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-blue-900 font-bold text-base sm:text-lg">Location</h3>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">Thaltej -Naroda -Ahmedabad</p>
                </div>
              </div>

              <div className="h-px bg-blue-200"></div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-blue-900 text-white p-2.5 sm:p-3 rounded-full shrink-0 flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-blue-900 font-bold text-base sm:text-lg">No. of Openings</h3>
                  <p className="text-gray-800 font-semibold text-lg sm:text-xl">2000 Riders</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right panel — static card on mobile, tilted on desktop */}
          <div className="flex justify-center lg:justify-end relative">
            <div className="w-full bg-blue-900 rounded-2xl sm:rounded-3xl lg:transform lg:rotate-3 flex items-center justify-center p-6 sm:p-8 overflow-hidden">
               <div className="w-full text-center space-y-4 sm:space-y-6 flex flex-col items-center">
                 <div className="text-yellow-400 font-bold text-lg sm:text-2xl flex items-center gap-2">
                   <Shield className="w-6 h-6 sm:w-8 sm:h-8"/> Ethical Corporate Culture
                 </div>
                 <div className="text-white text-base sm:text-lg">Stable & Secure Job</div>
                 <div className="text-white text-base sm:text-lg">Career Growth Opportunities</div>
                 <div className="text-white text-base sm:text-lg font-semibold bg-white/10 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/20">Fixed Monthly Income</div>
                 
                 <div className="mt-4 sm:mt-8 flex justify-center space-x-4 sm:space-x-6">
                   <div className="text-white flex flex-col items-center">
                     <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-1" />
                     <span className="text-xs">Direct Payroll</span>
                   </div>
                   <div className="text-white flex flex-col items-center">
                     <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-1" />
                     <span className="text-xs">Fixed Income</span>
                   </div>
                   <div className="text-white flex flex-col items-center">
                     <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-1" />
                     <span className="text-xs">Growth</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          
          {/* Salary & Work Structure */}
          <section className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-blue-900 flex items-center px-4 sm:px-6 py-3 sm:py-4">
               <Wallet className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6 mr-2.5 sm:mr-3" />
               <h2 className="text-white font-bold text-base sm:text-lg tracking-wide uppercase">Salary & Work Structure</h2>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 text-gray-700">
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <div className="bg-blue-100 text-blue-700 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <div className="text-sm sm:text-base"><strong className="text-gray-900">Fixed Salary:</strong> <span className="text-blue-800 font-semibold bg-blue-50 px-2 py-0.5 rounded">Earn up to 30,000/-</span></div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <div className="bg-blue-100 text-blue-700 p-1 rounded-full shrink-0 mt-0.5"><Clock className="w-4 h-4"/></div>
                  <div className="text-sm sm:text-base"><strong className="text-gray-900">Login Hours:</strong> <span className="text-blue-800 font-semibold">10 hours per day (Required)</span></div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <div className="bg-blue-100 text-blue-700 p-1 rounded-full shrink-0 mt-0.5"><Briefcase className="w-4 h-4"/></div>
                  <div className="text-sm sm:text-base"><strong className="text-gray-900">Fixed Working Hours as per Government Compliances</strong></div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <div className="bg-blue-100 text-blue-700 p-1 rounded-full shrink-0 mt-0.5"><TrendingUp className="w-4 h-4"/></div>
                  <div className="text-sm sm:text-base"><strong className="text-gray-900">Overtime Incentives Available</strong></div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <div className="bg-blue-100 text-blue-700 p-1 rounded-full shrink-0 mt-0.5"><Shield className="w-4 h-4"/></div>
                  <div className="text-sm sm:text-base"><strong className="text-gray-900">No hidden deductions like freelance/Gig model</strong></div>
                </li>
              </ul>
            </div>
          </section>

          {/* Why Join UTTAM */}
          <section className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-yellow-400 flex items-center px-4 sm:px-6 py-3 sm:py-4">
               <Heart className="text-blue-900 w-5 h-5 sm:w-6 sm:h-6 mr-2.5 sm:mr-3 fill-current" />
               <h2 className="text-blue-900 font-bold text-base sm:text-lg tracking-wide uppercase">Why Join UTTAM</h2>
            </div>
            <div className="p-4 sm:p-6 text-gray-700 h-full bg-blue-50/50">
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <div className="bg-yellow-400 text-blue-900 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <span className="font-medium text-gray-800 text-base sm:text-lg">Stable & Secure Job</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <div className="bg-yellow-400 text-blue-900 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <span className="font-medium text-gray-800 text-base sm:text-lg">Fixed Monthly Income</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <div className="bg-yellow-400 text-blue-900 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <span className="font-medium text-gray-800 text-base sm:text-lg">Career Growth Opportunities</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <div className="bg-yellow-400 text-blue-900 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <span className="font-medium text-gray-800 text-base sm:text-lg">Promotion & Performance Incentives</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <div className="bg-yellow-400 text-blue-900 p-1 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4"/></div>
                  <span className="font-medium text-gray-800 text-base sm:text-lg">Ethical Corporate Culture</span>
                </li>
              </ul>
            </div>
          </section>

        </div>

        {/* THREE COLUMNS: Work Scope / What we Provide / Employee Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

          {/* Work Scope */}
          <div className="bg-white border hover:border-blue-300 transition-colors rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col group">
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="bg-green-100 text-green-600 p-3 sm:p-4 rounded-full mb-2 sm:mb-3 group-hover:-translate-y-2 transition-transform">
                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-blue-900 font-bold uppercase tracking-wide text-sm sm:text-base">Work Scope</h3>
            </div>
            <ul className="space-y-3 sm:space-y-4 text-gray-700 flex-grow text-sm sm:text-base">
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
          <div className="bg-white border hover:border-blue-300 transition-colors rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col group">
             <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="bg-blue-100 text-blue-900 p-3 sm:p-4 rounded-full mb-2 sm:mb-3 group-hover:-translate-y-2 transition-transform">
                <Bike className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-blue-900 font-bold uppercase tracking-wide text-sm sm:text-base">What We Provide</h3>
            </div>
            <ul className="space-y-3 sm:space-y-4 text-gray-700 flex-grow text-sm sm:text-base">
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
          <div className="bg-white border hover:border-blue-300 transition-colors rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col group relative overflow-hidden sm:col-span-2 md:col-span-1">
             
            <div className="flex flex-col items-center mb-4 sm:mb-6 relative z-10">
              <div className="bg-red-100 text-red-600 p-3 sm:p-4 rounded-full mb-2 sm:mb-3 group-hover:-translate-y-2 transition-transform">
                <Users className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-blue-900 font-bold uppercase tracking-wide text-sm sm:text-base">Employee Benefits</h3>
            </div>
            <ul className="space-y-3 sm:space-y-4 text-gray-700 flex-grow relative z-10 text-sm sm:text-base">
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
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden flex flex-col items-center gap-5 sm:gap-6 sm:flex-row sm:justify-between shadow-lg">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          
          <div className="z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="bg-white p-3 sm:p-4 rounded-full shadow-lg transform -rotate-12">
              <Megaphone className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
            </div>
             <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-5xl font-black text-white italic tracking-tight uppercase mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                APPLY NOW
              </h2>
              <div className="inline-block bg-yellow-400 text-blue-900 font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm uppercase tracking-wider transform -skew-x-12 border border-yellow-500">
                <span className="inline-block transform skew-x-12">Limited Positions Available!</span>
              </div>
            </div>
          </div>
          
          <Link 
            to="/register" 
            className="z-10 w-full sm:w-auto justify-center bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-blue-900 font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full text-base sm:text-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 sm:hover:scale-105 uppercase tracking-wide border-2 border-yellow-300 ring-4 ring-blue-900/10 flex items-center gap-2"
          >
            Register Today <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6"/>
          </Link>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-200 py-6 sm:py-8 text-center text-xs sm:text-sm border-t border-blue-900 safe-bottom">
        <p className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} UTTAM Business Consultancy. All rights reserved. <Link to="/admin" className="hover:text-white transition-colors">Direct Company Payroll</Link> Recruitment.
        </p>
      </footer>

      {/* Promotional Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in-up">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setShowPopup(false)}></div>
          
          <div className="bg-white rounded-t-2xl sm:rounded-2xl relative w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh] sm:max-h-[90vh] animate-scale-in">
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
                className="w-full h-auto min-h-[200px] sm:min-h-[300px] object-contain object-top"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  document.getElementById('fallback-banner')?.classList.remove('hidden');
                  document.getElementById('fallback-banner')?.classList.add('flex');
                }}
              />
              <div id="fallback-banner" className="hidden flex-col items-center justify-center p-6 sm:p-8 text-center space-y-3 sm:space-y-4 bg-gradient-to-b from-blue-50 to-white min-h-[280px] sm:min-h-[400px]">
                  <div className="bg-yellow-400 text-blue-900 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wider mb-2 animate-pulse">Missing Image</div>
                  <h3 className="text-3xl sm:text-4xl font-black text-blue-900 italic uppercase leading-none">Summer Bonus<br/>Mela</h3>
                  <p className="font-black text-red-600 text-2xl sm:text-3xl">₹12,000 <span className="text-lg sm:text-xl">Bonus</span></p>
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-orange-100 mt-3 sm:mt-4 max-w-sm text-left">
                    <p className="text-gray-700 text-xs sm:text-sm">
                      <strong className="text-orange-500 block mb-1">Action Required:</strong>
                      In the code editor's file panel, click the <b>Upload File</b> button (cloud icon with up arrow), select your image, and rename it to <strong className="text-blue-600 font-mono bg-blue-50 px-1">bonus-banner.jpg</strong>. Move it to the <b>public</b> folder.
                    </p>
                  </div>
              </div>
            </div>
            
            <div className="p-3 sm:p-5 bg-white border-t border-gray-200 flex-shrink-0 flex justify-center sticky bottom-0 z-10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] safe-bottom">
              <Link 
                to="/register"
                onClick={() => setShowPopup(false)}
                className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-blue-900 font-black py-3 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 uppercase tracking-wider border border-yellow-500 w-full text-center text-base sm:text-lg flex items-center justify-center gap-2"
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
