import Link from 'next/link';
import { useContext } from 'react';
import { LanguageContext } from '../pages/_app';

export default function Navbar() {
  const { lang, setLang } = useContext(LanguageContext);

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-b border-white/5 z-[100] px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo - පෝන් එකේදී ටිකක් පොඩි කළා */}
        <Link href="/" className="group flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-rose-600 rounded-lg flex items-center justify-center font-black text-white italic group-hover:rotate-12 transition-transform text-sm">W</div>
          <span className="text-lg md:text-xl font-black tracking-tighter text-white uppercase">
            Wedding<span className="text-rose-600">App</span>
          </span>
        </Link>

        {/* Navigation Links - පෝන් එකේදීත් පේන්න 'hidden' එක අයින් කළා, හැබැයි පොඩියට පේන්න හැදුවා */}
        <div className="flex items-center gap-3 md:gap-8">
          <div className="flex gap-4 md:gap-8 text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em]">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              User
            </Link>
            <Link href="/admin/dashboard" className="text-rose-500 hover:text-rose-400 transition-colors border-l border-white/10 pl-4 md:pl-8">
              Admin
            </Link>
          </div>

          {/* Language Switcher - පෝන් එකට ගැලපෙන පෑඩින් දැම්මා */}
          <div className="flex gap-1 bg-white/5 p-0.5 md:p-1 rounded-xl border border-white/10">
            {[
              { id: 'en', label: 'EN' },
              { id: 'si', label: 'සිං' },
            ].map((l) => (
              <button 
                key={l.id}
                onClick={() => setLang(l.id)} 
                className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[8px] md:text-[9px] font-black transition-all ${
                  lang === l.id 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                  : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}