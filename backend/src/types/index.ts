export interface ServiceDoc {
  name: string
  description: string
  price: number
  duration: number
  imageUrl?: string
  createdAt: FirebaseFirestore.Timestamp
  updatedAt: FirebaseFirestore.Timestamp
}

export interface BarberDoc {
  name: string
  specialty: string
  rating: number
  reviewCount: number
  available: boolean
  imageUrl?: string
  createdAt: FirebaseFirestore.Timestamp
  updatedAt: FirebaseFirestore.Timestamp
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface AppointmentDoc {
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
  status: AppointmentStatus
  finalPrice?: number
  notes?: string
  createdAt: FirebaseFirestore.Timestamp
  updatedAt: FirebaseFirestore.Timestamp
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

declare global {
  namespace Express {
    interface Request {
      uid?: string
    }
  }
}
