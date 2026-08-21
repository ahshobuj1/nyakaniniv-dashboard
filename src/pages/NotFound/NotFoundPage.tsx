import { Link } from 'react-router';
import { LayoutDashboard, ArrowLeft, Disc3 } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col justify-between relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/upbeat.png" alt="logo" width={36} height={36} className="mb-1" />
          <span className="text-lg font-semibold">
            UpBeat <span className="text-primary">Entertainment Africa</span>
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-6 py-12 text-center relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary/30 to-slate-800/80 p-1 mb-6 flex items-center justify-center border border-white/10 shadow-2xl">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-primary">
            <Disc3 className="w-14 h-14 animate-spin [animation-duration:8s]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          Admin Notice • 404
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Page Not Found
        </h1>

        <p className="text-slate-400 text-sm md:text-base mb-8 max-w-md">
          The requested admin dashboard route does not exist or might have been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-red-600 text-white font-medium py-3 px-5 rounded-lg transition-all shadow-md shadow-primary/20">
            <LayoutDashboard size={18} />
            <span>Go to Dashboard</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-5 rounded-lg border border-slate-700 transition-all">
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-800/80 relative z-10">
        © {new Date().getFullYear()} UpBeat Entertainment Africa Admin Portal.
      </footer>
    </div>
  );
}
