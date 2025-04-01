import { Router } from 'express'
import { OvaController } from '@api/controllers/ova.controller'

export const ovasRouter = Router()

// OVA Router
ovasRouter.get('/', async (req, res, next) => {
    try {
        await OvaController.getAllOvas(req, res)
    } catch (error) {
        next(error)
    }
})