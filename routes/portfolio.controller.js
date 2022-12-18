import {portfolioService} from '../services/portfolio.service.js'
import {authenticateToken} from '../services/jwt.service.js'
import {router} from './router.js'

router.post('/portfolio',authenticateToken, async function(req, res, next) {
    res.promise(portfolioService.createPortfolio(req))
});

router.delete('/portfolio/:id',authenticateToken, async function(req, res, next) {
    res.promise(portfolioService.deletePortfolio(req))
});

router.get('/portfolios',authenticateToken, async function(req, res, next) {
    res.promise(portfolioService.getPortfolios(req))
});

export default router;
