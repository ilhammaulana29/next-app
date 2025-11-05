// app/layout.tsx
import './globals.css'
import 'antd/dist/reset.css'
import { ConfigProvider } from 'antd'
import React from 'react'

export const metadata = {
  title: 'Product Management',
  description: 'Next.js + Ant Design + Axios Example',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  )
}
