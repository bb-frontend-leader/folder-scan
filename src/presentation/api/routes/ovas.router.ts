import { Router } from 'express'

import { OvaController } from '../controllers/ova.controller'
import { ZipController } from '../controllers/zip.controller'

export const ovasRouter = Router()

// OVA Router
ovasRouter.get('/', async (req, res, next) => {
    try {
        await OvaController.getAllOvas(req, res)
    } catch (error) {
        next(error)
    }
})

ovasRouter.get('/groups', async(req, res, next) => {
    try {
        await OvaController.getAllOvaGroups(req, res)
    } catch (error) {
        next(error)
    }
})

ovasRouter.get('/zip/:id', async (req, res, next) => {
    try {
        await ZipController.downloadZip(req, res)
    } catch (error) {
        next(error)
    }
})