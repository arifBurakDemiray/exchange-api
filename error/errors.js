export class UnauthorizedError extends Error {
    constructor () {
        super()
    
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);

      }
}