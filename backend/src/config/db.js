import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDB() {
  await mongoose.connect(env.mongoUri)
  // Keep startup logging short and explicit.
  console.log(`MongoDB connected at ${mongoose.connection.host}`)
}
