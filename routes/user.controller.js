import {userService} from '../services/user.service.js'
import {authenticateToken} from '../services/jwt.service.js'
import {router} from './router.js'

router.patch('/deposit',authenticateToken, async function(req, res, next) {
    res.promise(userService.depositMoney(req))
});

export default router;
