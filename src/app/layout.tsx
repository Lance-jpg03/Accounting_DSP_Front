import { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Project Flash',
  description: 'dsp form management system',
  icons: { icon: { url: '/filscap.jpg' } },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
