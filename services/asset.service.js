import {getUserId} from './jwt.service.js'
import { orm } from '../db/db.js'
import {Response} from '../util/response.js'


export const assetService = {

    async getAll(req){
        const userId = getUserId(req)

        const assets = await orm.asset.findMany({
            where: {
                user_id: userId
            },
            select:{
                id: true,
                rate: true,
                created_at: true,
                share: {
                    select:{
                        id: true,
                        symbol: true,
                        price: true
                    }
                }
            }
        })

        return Response().data(assets).build()
    }
}
