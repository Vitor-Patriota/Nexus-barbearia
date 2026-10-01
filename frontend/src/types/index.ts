export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  imageUrl?: string
}

export interface Barber {
  id: string
  name: string
  specialty: string
  rating: number
  reviewCount: number
  imageUrl?: string
  available: boolean
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface Appointment {
  id?: string
  serviceId: string
  serviceName: string
  servicePrice: number
  barberId: string
  barberName: string
  date: string
  time: string
  clientName: string
  clientPhone: string
  clientEmail: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  finalPrice?: number
  notes?: string
  createdAt?: string
}

export interface BookingFormData {
  service: Service | null
  barber: Barber | null
  date: string
  time: string
  clientName: string
  clientPhone: string
  clientEmail: string
}

export interface AdminStats {
  totalRevenue: number
  totalClients: number
  newClients: number
  pendingServices: number
  completedServices: number
  cancelledServices: number
}

export interface RevenueData {
  period: string
  revenue: number
  appointments: number
}

export interface FinishServicePayload {
  finalPrice: number
  notes?: string
}
