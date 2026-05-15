import "@/styles/globals.css";
import { useState, createContext, useEffect } from "react";
import { translations } from "../translations";
import Navbar from "@/components/Navbar";

// භාෂාව පාලනය කරන්න Context එකක් හදනවා
export const LanguageContext = createContext();

export default function App({ Component, pageProps }) {
  const [lang, setLang] = useState("en"); // Default English

  // පේජ් එක load වෙද්දී කලින් තෝරපු භාෂාව ලබා ගැනීම
  useEffect(() => {
    const savedLang = localStorage.getItem("appLang");
    if (savedLang) setLang(savedLang);
  }, []);

  // භාෂාව මාරු කරන කොට ඒක Save කරගන්න function එක
  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem("appLang", newLang);
  };

  const t = translations[lang] || translations["en"];

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleLangChange, t }}>
      {/* bg-slate-950: මුළු සයිට් එකේම පසුබිම කළු පාටට තියාගන්නවා.
        min-h-screen: content එක අඩු වුණත් screen එක සම්පූර්ණයෙන් කළු පාටට තියාගන්නවා.
      */}
      <div className="bg-slate-950 min-h-screen selection:bg-rose-500/40 selection:text-rose-200 antialiased overflow-x-hidden">
        
        {/* Navbar එක හැම page එකකම පේන්න මෙතනට දැම්මා */}
        <Navbar /> 
        
        {/* Main Content Area:
          pt-20: Mobile වලදී Navbar එකට පල්ලෙයින් පටන් ගන්න.
          md:pt-28: Laptop වලදී තව ටිකක් ඉඩ තියන්න.
          px-4: Mobile වලදී දෙපැත්තෙන් අකුරු ඇල නොවී තියෙන්න පොඩි ඉඩක් (padding) තැබුවා.
        */}
        <main className="pt-20 md:pt-28 px-4 md:px-0 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
             <Component {...pageProps} />
          </div>
        </main>

        {/* මෙතනට පසුව ඔයාට Footer එකක් එකතු කරන්න පුළුවන් */}
      </div>
    </LanguageContext.Provider>
  );
}