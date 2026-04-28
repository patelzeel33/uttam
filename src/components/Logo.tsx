export default function Logo({ className = "w-16 h-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Tab Shape */}
      <path d="M0 0 H400 V400 C400 455.2 355.2 500 300 500 H100 C44.8 500 0 455.2 0 400 V0 Z" fill="#032675"/>
      
      {/* Abstract U Mark */}
      <g transform="translate(0, 0)">
        {/* Left top segment */}
        <path d="M 120 80 V 130" stroke="white" strokeWidth="45"/>
        
        {/* Left outer bottom curve */}
        <path d="M 120 170 V 280 C 120 370 280 370 280 280" stroke="white" strokeWidth="45"/>
        
        {/* Inner vertical & right curve */}
        <path d="M 195 130 V 280 C 195 320 280 320 280 280 V 170" stroke="white" strokeWidth="45"/>
        
        {/* Yellow Dot */}
        <circle cx="280" cy="80" r="40" fill="#F6A800"/>
      </g>

      {/* Typography */}
      <text x="200" y="415" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="68" fill="white" textAnchor="middle" letterSpacing="5">UTTAM</text>
      <text x="200" y="455" fontFamily="Arial, Helvetica, sans-serif" fontWeight="400" fontSize="24" fill="white" textAnchor="middle" letterSpacing="0.5">Business Consultancy</text>
    </svg>
  );
}
