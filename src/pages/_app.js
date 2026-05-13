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
      {/* කළු පසුබිම මුළු සයිට් එකටම ලැබෙන්න මෙතනින් හැදුවා */}
      <div className="bg-slate-950 min-h-screen selection:bg-rose-500 selection:text-white">
        
        {/* Navbar එක හැම page එකකම පේන්න මෙතනට දැම්මා */}
        <Navbar /> 
        
        {/* Content එක Navbar එකට යට නොවෙන්න padding-top (pt-24) එකක් දුන්නා */}
        <main className="pt-20 md:pt-24">
          <Component {...pageProps} />
        </main>

      </div>
    </LanguageContext.Provider>
  );
}