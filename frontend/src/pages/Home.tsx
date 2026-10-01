import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import About from '../components/About/About'
import Services from '../components/Services/Services'
import Gallery from '../components/Gallery/Gallery'
import Team from '../components/Team/Team'
import Testimonials from '../components/Testimonials/Testimonials'
import Footer from '../components/Footer/Footer'
import BookingModal from '../components/Booking/BookingModal'
import { useBooking } from '../contexts/BookingContext'

export default function Home() {
  const { isOpen } = useBooking()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Team />
        <Testimonials />
      </main>
      <Footer />
      {isOpen && <BookingModal />}
    </>
  )
}
