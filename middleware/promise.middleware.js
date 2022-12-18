import  jwt  from "jsonwebtoken";
import { HttpStatus } from "../enums/status.enum.js";
import { UnauthorizedError } from "../error/errors.js";

const handleResponse = (res, response) => res.status(response.status).send(response);
const handleError = (req,res, err = {}) => {

    if(err instanceof UnauthorizedError){
        res
        .status(err.status || HttpStatus.UNAUTHORIZED)
        .send({message: req.t('status.unauthorized')})
    }
    else if(err instanceof jwt.JsonWebTokenError){
        res
        .status(err.status || HttpStatus.ACCESS_DENIED)
        .send({message: req.t('status.forbidden')})
    }
    else{

        console.log(err)

        res
        .status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .send({message: req.t('status.unhandled')})
    }

}


export function promiseMiddleware() {
  return (req,res,next) => {
    res.promise = (p) => {
      let promiseToResolve;
      if (p.then && p.catch) {
        promiseToResolve = p;
      } else if (typeof p === 'function') {
        promiseToResolve = Promise.resolve().then(() => p());
      } else {
        promiseToResolve = Promise.resolve(p);
      }

      return promiseToResolve
        .then((response) => handleResponse(res, response))
        .catch((e) => handleError(req,res, e));  
    };

    return next();
  };
}