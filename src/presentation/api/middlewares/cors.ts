
import cors from 'cors'

import { envs } from '@/config/plugins/envs.plugin'

const ACCEPTED_ORIGINS = [
    'http://localhost:4321',
    envs.SCREENSHOTS_STORAGE_URL,
  ]
  
export const corsMiddleware = ({ 
    acceptedOrigins = ACCEPTED_ORIGINS,
} = {}) => cors({
    origin: (origin, callback) => {
      if (!origin || acceptedOrigins.includes(origin)) {
        callback(null, origin)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
})