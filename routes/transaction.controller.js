import {transactionService} from '../services/transaction.service.js'
import {authenticateToken} from '../services/jwt.service.js'
import {router} from './router.js'

router.get('/transactions',authenticateToken, async function(req, res, next) {
    res.promise(transactionService.getAll(req))
});

router.post('/transaction',authenticateToken, async function(req, res, next) {
    res.promise(transactionService.postTransaction(req))
});

export default router;
