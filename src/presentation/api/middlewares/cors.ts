
import cors from 'cors'

const ACCEPTED_ORIGINS = [
    'http://localhost:4321',
    'https://demos.booksandbooksdigital.com.co/200-ovas-2025/',
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