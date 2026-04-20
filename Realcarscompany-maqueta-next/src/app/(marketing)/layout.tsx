import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SplashScreen from '@/components/SplashScreen'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTopButton from '@/components/BackToTopButton'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SplashScreen />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <WhatsAppButton />
      <BackToTopButton />
    </>
  )
}
