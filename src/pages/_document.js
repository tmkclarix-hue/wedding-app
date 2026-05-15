import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        {/* Mobile වලදී Screen එකට හරියටම fit වෙන්න මේ tag එක වැදගත් */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        
        {/* Luxury Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600;900&display=swap"
          rel="stylesheet"
        />
        
        {/* Theme Color - Android/iOS Chrome එකේ උඩ bar එකේ පාට වෙනස් කරන්න */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="description" content="Premium Wedding Directory - Find your perfect wedding partners" />
      </Head>
      
      {/* Body එකේ background එක මෙතනම දාපුවාම 
        පේජ් එක load වෙද්දී සුදු පාටට පෙනිලා (Flash) කළු වෙන එක නවතිනවා 
      */}
      <body className="antialiased bg-[#0f172a] text-slate-200 selection:bg-rose-500/30">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}