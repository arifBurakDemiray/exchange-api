import {todoService} from '../services/todo.service.js'
import {authenticateToken} from '../services/jwt.service.js'
import {router} from './router.js'

/* GET todo listing. */
router.get('/todos',authenticateToken, async function(req, res, next) {
    const result = await todoService.getAll(req)
    res.status(result.status).json(result)
});

router.post('/todo',authenticateToken, async function(req, res, next) {
    const result = await todoService.addTodo(req)
    res.status(result.status).json(result) 
});

router.patch('/todo:id',authenticateToken,async function(req, res, next) {
    const result = await todoService.updateTodo(req)
    res.status(result.status).json(result)
});

router.delete('/todo:id',authenticateToken,async function(req, res, next) {
    const result = await todoService.deleteTodo(req)
    res.status(result.status).json(result)
});

export default router;
