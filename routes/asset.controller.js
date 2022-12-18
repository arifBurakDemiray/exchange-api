import { assetService } from '../services/asset.service.js';
import {authenticateToken} from '../services/jwt.service.js'
import {router} from './router.js'

router.get('/assets',authenticateToken, async function(req, res, next) {
    res.promise(assetService.getAll(req))
});

export default router;
