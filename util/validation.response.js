
export function ValidResponse() {

    let result = {
        response: undefined,
        valid: true
    }

    return {
        response: function(response){
            result.response = response
            return this
        },
        valid: function(valid){
            result.valid = valid
            return this
        },
        build: function(){
            return result
        },

    }

}