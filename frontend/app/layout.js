import './globals.css'

export const metadata = {
  title: 'Top 10 Music Chart',
  description: 'Your daily dose of the top 10 tracks.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 