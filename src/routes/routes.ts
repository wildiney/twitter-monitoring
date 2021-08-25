import { Router, Request, Response } from 'express'

import { monitoramento } from '../controllers/twitterstreamController'

const router = Router()

router.get('/', monitoramento)

router.get('*', function (req: Request, res: Response) {
  res.json({ status: 404 })
})

export default router
