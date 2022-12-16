import {getUserId} from './jwt.service.js'
import { orm } from '../db/db.js'
import {Response} from '../util/response.js'
import { HttpStatus } from '../enums/status.enum.js'


export const collectionService = {

    async getAll(req){
        
        const userId = getUserId(req)
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)

        const collections = await orm.collection.findMany({
            orderBy: [
                {
                    updated_at: 'desc'
                }
            ],
            skip: page*size,
            take: size,
            where : {
                AND:{
                    active: true,
                    user_id: userId
                }
            },
            include: {
                id: true,
                name: true,
                created_at: true,
                updated_at: true,
                priority: true,
                type: true,
                blocked: true,
                deletable: true
            }
        })
        
        return Response().data(collections).build()
    },

    async addCollection(req){
        const userId = getUserId(req)

        const previousId = req.body.previous_id
        const nextId = req.body.next_id

        const priority = await orm.collection.aggregate({
            _avg: {
                priority: true
            },
            where: {
                AND: {
                    id: [previousId,nextId],
                    user_id: userId
                }
            }
        })

        const created = await orm.collection.create({
            data: {
                user_id : userId,
                name: req.body.name,
                priority: priority ? priority : 100,
                type: req.body.type,
                blocked: req.body.blocked,
                deletable: req.body.deletable
            }
        })

        return Response().data(created).build()
    },
    async deleteCollection(req){
        const userId = getUserId(req)
        const collectionId = req.query.id

        const maybeCollection = await orm.collection.findFirst({
            where:{
                AND:{
                    id: collectionId,
                    user_id: userId,
                    active: true
                }
            },
            include: {
                id: true,
                deletable: true
            }
        })

        if(!maybeCollection)
        {
            return Response().message(req.t('todo.not_permissible')).status(HttpStatus.ACCESS_DENIED).build()
        }


        if(!maybeCollection.deletable){
            await orm.collection.update({
                where:{
                    id: todoId,
                     user_id: userId
                    },
                data: {
                    active: false
                }
            })

            return Response().message(req.t('success'))
        }

        await orm.todo.deleteMany({
            where: {
                collection_id: collectionId
            }
        })

        await orm.collection.delete({
            where: {
                id: collectionId
            }
        })

        return Response().message(req.t('success'))

    },
}
