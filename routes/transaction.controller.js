import {transactionService} from '../services/transaction.service.js'
import {authenticateToken} from '../services/jwt.service.js'
import {router} from './router.js'

/* GET todo listing. */
router.get('/transactions',authenticateToken, async function(req, res, next) {
    const result = await transactionService.getAll(req)
    res.status(result.status).json(result)
});

router.post('/transaction',authenticateToken, async function(req, res, next) {
    const result = await transactionService.postTransaction(req)
    res.status(result.status).json(result) 
});


export default router;
//benim anladigim su en bastaki, kullanicilar share yaratiyo sonra bunlari kendileri fiyat belirleyerek satabiliyor, sell buy farkli endpoint olcak