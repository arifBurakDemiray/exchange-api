import {authenticateToken} from '../services/jwt.service.js'
import {router} from './router.js'
import {shareService} from '../services/share.service.js'

router.get('/shares',authenticateToken, async function(req, res, next) {
    res.promise(shareService.getAll(req))
});

router.post('/share',authenticateToken, async function(req, res, next) {
    res.promise(shareService.postShare(req))
});

export default router;
