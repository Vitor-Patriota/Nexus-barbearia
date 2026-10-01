import { createContext, useContext, useState, type ReactNode } from 'react'
import type { BookingFormData, Service, Barber } from '../types'

interface BookingContextType {
  isOpen: boolean
  currentStep: number
  formData: BookingFormData
  openBooking: () => void
  closeBooking: () => void
  nextStep: () => void
  prevStep: () => void
  setService: (service: Service) => void
  setBarber: (barber: Barber) => void
  setDateTime: (date: string, time: string) => void
  setClientDetails: (name: string, phone: string, email: string) => void
  resetBooking: () => void
}

const initialFormData: BookingFormData = {
  service: null,
  barber: null,
  date: '',
  time: '',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
}

const BookingContext = createContext<BookingContextType | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>(initialFormData)

  const openBooking = () => {
    setIsOpen(true)
    setCurrentStep(1)
  }

  const closeBooking = () => {
    setIsOpen(false)
    setCurrentStep(1)
    setFormData(initialFormData)
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const setService = (service: Service) =>
    setFormData((prev) => ({ ...prev, service }))

  const setBarber = (barber: Barber) =>
    setFormData((prev) => ({ ...prev, barber }))

  const setDateTime = (date: string, time: string) =>
    setFormData((prev) => ({ ...prev, date, time }))

  const setClientDetails = (clientName: string, clientPhone: string, clientEmail: string) =>
    setFormData((prev) => ({ ...prev, clientName, clientPhone, clientEmail }))

  const resetBooking = () => {
    setCurrentStep(1)
    setFormData(initialFormData)
  }

  return (
    <BookingContext.Provider
      value={{
        isOpen,
        currentStep,
        formData,
        openBooking,
        closeBooking,
        nextStep,
        prevStep,
        setService,
        setBarber,
        setDateTime,
        setClientDetails,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used within BookingProvider')
  return context
}
