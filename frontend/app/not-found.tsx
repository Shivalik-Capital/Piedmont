import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[100vh] w-full bg-[#0b0b0b] flex flex-col items-center justify-center text-center p-8 selection:bg-[#479ffa]/30 selection:text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-[120px] md:text-[160px] font-bold text-white tracking-[-0.08em] leading-none mb-2 opacity-5">
          404
        </div>
        <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-[-0.03em] mb-4">
          Endpoint Not Found
        </h2>
        <p className="text-[#868f97] text-[16px] max-w-[400px] mx-auto mb-10 leading-[1.6]">
          The terminal endpoint you requested does not exist. The asset may have been delisted, or the query parameters are malformed.
        </p>
        
        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all duration-300"
        >
          <span className="material-symbols-outlined text-[18px]">keyboard_return</span>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
