import { Router, Request, Response } from 'express'

import { monitoramento } from '../controllers/twitterstreamController'
import { robots } from '../controllers/robotsController'

const router = Router()

router.get('/', monitoramento)

router.get('/robots.txt', robots)

router.get('*', function (req: Request, res: Response) {
  res.json({ status: 404 })
})

export default router
