import { Inter } from 'next/font/google';
import './globals.css'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Music Chart with Custom Algorithm',
  description: 'A dynamic music chart powered by a custom ranking algorithm.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 