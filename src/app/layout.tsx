import { Context } from 'elysia'

import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

export default function RootLayout({
  children,
  ctx,
}: {
  children: JSX.Element
  ctx: Context
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SE19 Study Planner</title>
        <link rel="stylesheet" href="/public/style.css" />
        <link rel="shortcut icon" href="/public/favicon.png" type="image/png" />
      </head>
      <body>
        <div className="relative w-full">
          <Navbar ctx={ctx} className="fixed top-0 z-50" />

          <div className="flex min-h-screen flex-col justify-between pt-16">
            <div className="grid grow">{children}</div>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}
