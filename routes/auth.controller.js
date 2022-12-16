import {authService} from '../services/auth.service.js'
import {router} from './router.js';

router.post('/token', async function(req, res, next) {

  const result = await authService.authenticate(req)
  res.status(result.status).json(result)

});

router.post('/register', async function(req, res, next) {

  const result = await authService.register(req)
  res.status(result.status).json(result)

});

router.get('/confirm', async function(req, res, next) {

  const result = await authService.confirm(req)
  res.status(result.status).json(result)

});

router.post('/confirm-again', async function(req, res, next) {

  const result = await authService.sendAgain(req)
  res.status(result.status).json(result)

});

router.post('/reset-password', async function(req, res, next) {

  const result = await authService.resetPassword(req)
  res.status(result.status).json(result)

});

export default router;

