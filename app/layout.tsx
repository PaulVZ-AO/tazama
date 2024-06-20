import "styles/tailwind.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-emerald-500 p-10">{children}</body>
    </html>
  )
}
