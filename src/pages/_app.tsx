import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <main className="min-h-screen">
          <Component {...pageProps} />
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  )
}
