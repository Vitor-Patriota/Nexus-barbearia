import * as admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Firebase Admin once
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined

  admin.initializeApp({
    credential: serviceAccount
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  })
}

export const db = admin.firestore()
export const authAdmin = admin.auth()

export default admin
