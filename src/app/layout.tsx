import { Metadata } from 'next';
import { ReactNode } from 'react';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Project Flash',
  description: 'dsp form management system',
  icons: { icon: { url: '/filscap.jpg' } },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}