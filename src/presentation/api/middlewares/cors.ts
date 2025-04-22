
import cors from 'cors'

export const corsMiddleware = () => cors({
  origin: '*',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})
