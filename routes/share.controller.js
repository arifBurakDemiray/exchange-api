import {authenticateToken} from '../services/jwt.service.js'
import {router} from './router.js'
import {shareService} from '../services/share.service.js'

router.get('/shares',authenticateToken, async function(req, res, next) {
    const result = await shareService.getAll(req)
    res.status(result.status).json(result)
});

router.post('/share',authenticateToken, async function(req, res, next) {
    const result = await shareService.postShare(req)
    res.status(result.status).json(result) 
});

export default router;
