import { useState } from "react";
import { MessageCircle, Phone, Mail, Share2, X, Plus } from "lucide-react";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join UTTAM - Delivery Partner Jobs',
          text: '2000 Delivery Partner Openings at UTTAM in Ahmedabad. Direct company payroll, fixed salary up to 30,000/-',
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that do not support Web Share API
        alert("Copy this link to share: " + window.location.href);
      }
    } catch (err) {
      console.log('Error sharing', err);
    }
  };

  return (
    <>
      {/* Backdrop when menu is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 sm:gap-3 items-center safe-bottom">
        {/* Action buttons — always visible on desktop, toggle on mobile */}
        <div
          className={`flex flex-col gap-2.5 sm:gap-3 items-center transition-all duration-300 ${isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none sm:opacity-100 sm:translate-y-0 sm:pointer-events-auto"
            }`}
        >
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-11 h-11 sm:w-13 sm:h-13 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 transition-all active:scale-90 hover:scale-110"
            title="Share this Job"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Email Button */}
          <a
            href="https://mail.google.com/mail/?view=cm&to=contact@uttamconsultancy.com&su=Application%20for%20Delivery%20Partner&body=Hello%2C%20I%20am%20interested%20in%20the%20Delivery%20Partner%20role."
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-13 sm:h-13 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all active:scale-90 hover:scale-110"
            title="Email Us"
          >
            <Mail className="w-5 h-5" />
          </a>

          {/* Call Button */}
          <a
            href="tel:+918866611564"
            className="w-11 h-11 sm:w-13 sm:h-13 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all active:scale-90 hover:scale-110"
            title="Call Us"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        {/* WhatsApp Button — always visible, largest */}
        <a
          href="https://wa.me/918866611564?text=Hi%2C%20I%20am%20interested%20in%20the%20Delivery%20Partner%20job%20at%20UTTAM"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 sm:w-[60px] sm:h-[60px] bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-green-600 transition-all active:scale-90 hover:scale-110"
          title="WhatsApp Us"
        >
          <MessageCircle className="w-7 h-7" />
        </a>

        {/* Toggle button — only visible on mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg sm:hidden transition-all active:scale-90"
          aria-label={isOpen ? "Close menu" : "Open contact menu"}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>
    </>
  );
}
