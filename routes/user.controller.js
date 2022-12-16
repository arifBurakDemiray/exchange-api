import {userService} from '../services/user.service.js'
import {authenticateToken} from '../services/jwt.service.js'
import {router} from './router.js'

/* GET todo listing. */
router.patch('/deposit',authenticateToken, async function(req, res, next) {
    const result = await userService.depositMoney(req)
    res.status(result.status).json(result)
});

export default router;
