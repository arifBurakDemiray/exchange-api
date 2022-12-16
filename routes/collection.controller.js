import {collectionService} from '../services/collection.service.js'
import {authenticateToken} from '../services/jwt.service.js'
import {router} from './router.js'

/* GET todo listing. */
router.get('/collections',authenticateToken, async function(req, res, next) {
    const result = await collectionService.getAll(req)
    res.status(result.status).json(result)
});

router.post('/collection',authenticateToken, async function(req, res, next) {
    const result = await collectionService.addCollection(req)
    res.status(result.status).json(result) 
});

router.delete('/collection:id',authenticateToken,async function(req, res, next) {
    const result = await collectionService.deleteCollection(req)
    res.status(result.status).json(result)
});

export default router;
