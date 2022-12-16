import {HttpStatus} from '../enums/status.enum.js'

export function Response() {

    let response = {
        status: HttpStatus.OK,
        message: undefined,
        data: undefined
    }

    return {
        status: function(status){
            response.status = status
            return this
        },
        message: function(message){
            response.message = message
            return this
        },
        data: function(data){
            response.data = data
            return this
        },
        build: function(){
            return response
        },

    }

}