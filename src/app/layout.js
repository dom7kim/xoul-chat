import './globals.css'
import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Xoul Chat",
  description: "Speak, Connect, and Grow at Xoul!",
  openGraph: {
    title: "Xoul Chat",
    description: "Speak, Connect, and Grow at Xoul!",
    url: "https://xoul-chat.vercel.app",
    siteName: "Xoul Chat",
    images: [
      {
        url: "https://xoul-chat.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="m-0 p-0">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}