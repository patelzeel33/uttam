import { MessageCircle, Phone, Mail, Share2 } from "lucide-react";

export default function FloatingContact() {
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-center">
      {/* Share Button */}
      <button 
        onClick={handleShare}
        className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 transition-transform hover:scale-110"
        title="Share this Job"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* Email Button */}
      <a 
        href="mailto:hr@example.com?subject=Application for Delivery Partner"
        className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
        title="Email Us"
      >
        <Mail className="w-5 h-5" />
      </a>

      {/* Call Button */}
      <a 
        href="tel:+910000000000"
        className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-transform hover:scale-110"
        title="Call Us"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/910000000000?text=Hi%2C%20I%20am%20interested%20in%20the%20Delivery%20Partner%20job%20at%20UTTAM"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-green-600 transition-transform hover:scale-110"
        title="WhatsApp Us"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
