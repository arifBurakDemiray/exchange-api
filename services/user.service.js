import {getUserId} from './jwt.service.js'
import { orm } from '../db/db.js'
import {Response} from '../util/response.js'


export const userService = {

    async depositMoney(req){
        const userId = getUserId(req)
        const moneyPrm = parseFloat(req.query.money)

        if(moneyPrm < 0.0){
            return Response().message(req.t('fail')).build()
        }

        const oldMoney = await orm.user.findFirst({
            where:{
                id: userId
            },
            select:{
                money: true
            }
        })

        await orm.user.update({
            where:{
                id: userId,
            },
            data: {
                money: oldMoney.money + moneyPrm
            }
        })

        return Response().message(req.t('success')).build()

    }
}
