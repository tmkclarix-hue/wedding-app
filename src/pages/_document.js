import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Luxury Fonts එකතු කිරීම (Cinzel for headings & Inter for body) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600;900&display=swap"
          rel="stylesheet"
        />
        {/* Browser එකේ උඩ පේන නම සහ Icon එක (Favicon) පසුව මෙතනට දාන්න පුළුවන් */}
        <meta name="description" content="Premium Wedding Directory" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}