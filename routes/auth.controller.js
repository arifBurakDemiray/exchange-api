import {authService} from '../services/auth.service.js'
import {router} from './router.js';

router.post('/token', async function(req, res, next) {

  res.promise(authService.authenticate(req))

});

router.post('/register', async function(req, res, next) {

  res.promise(authService.register(req))

});

router.get('/confirm', async function(req, res, next) {

  res.promise(authService.confirm(req))

});

router.post('/confirm-again', async function(req, res, next) {

  res.promise(authService.sendAgain(req))

});

router.post('/reset-password', async function(req, res, next) {

  res.promise(authService.resetPassword(req))

});

export default router;

