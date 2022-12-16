import {getUserId} from './jwt.service.js'
import { orm } from '../db/db.js'
import {Response} from '../util/response.js'
import { HttpStatus } from '../enums/status.enum.js'


export const todoService = {

    async getAll(req){
        
        const userId = getUserId(req)
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)
        const collectionId = req.query.cId

        const maybeCollection = await orm.collection.findFirst({
            where:{
                AND:{
                    id: collectionId,
                    user_id: userId,
                    active: true
                }
            }
        })

        if(!maybeCollection){
            return Response().message(req.t('todo.not_permissible')).status(HttpStatus.ACCESS_DENIED).build()
        }

        const todos = await orm.todo.findMany({
            orderBy: [
                {
                    done: 'asc',
                    priority: 'desc'
                }
            ],
            skip: page*size,
            take: size,
            where : {
                AND:{
                    active: true,
                    collection_id: collectionId
                }
            },
        })
        
        return Response().data(todos).build()
    },

    async addTodo(req){
        const userId = getUserId(req)
        const collectionId = req.query.cId

        const previousId = req.body.previous_id
        const nextId = req.body.next_id

        const maybeCollection = await orm.collection.findFirst({
            where:{
                AND:{
                    id: collectionId,
                    user_id: userId,
                    active: true
                }
            }
        })

        if(!maybeCollection){
            return Response().message(req.t('todo.not_permissible')).status(HttpStatus.ACCESS_DENIED).build()
        }

        const priority = await orm.todo.aggregate({
            _avg: {
                priority: true
            },
            where: {
                AND: {
                    id: [previousId,nextId],
                    collection: {connect: { user_id: userId}}
                }
            }
        })

        const created = await orm.todo.create({
            data: {
                collection_id : cId,
                name: req.body.name,
                priority: priority ? priority : 100,
                deadline: req.body.deadline,
                notify_me: req.body.notify_me
            }
        })

        return Response().data(created).build()
    },
    async deleteTodo(req){
        const userId = getUserId(req)
        const todoId = req.query.cId

        await orm.todo.update({
            where:{
                id: todoId,
                collection: {connect: { user_id: userId}}
            },
            data: {
                active: false
            }
        })

        return Response().message(req.t('success'))

    },
    async updateTodo(req){
        const userId = getUserId(req)
        const todoId = req.query.cId

        const previousId = req.body.previous_id
        const nextId = req.body.next_id

        const priority = await orm.todo.aggregate({
            _avg: {
                priority: true
            },
            where: {
                AND: {
                    id: [previousId,nextId],
                    collection: {connect: { user_id: userId}}
                }
            }
        })

        const updated = await orm.todo.update({
            where:{
                id: todoId,
                collection: {connect: { user_id: userId}}
            },
            data: {
                priority: priority ? priority : undefined,
                name: req.body.name ? req.body.name : undefined,
                deadline: req.body.deadline ? req.body.deadline : undefined,
                notify_me: req.body.notify_me ? req.body.notify_me : undefined,
                done: req.body.done ? req.body.done : undefined

            }
        })
        

        return Response().data(updated).build()
    }
  
}
