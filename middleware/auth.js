import { request, response } from "express";
import { verify } from "jsonwebtoken";

export const auth = (request, response, next) => {
    try {const token = request.heder('x-auth-token');
    console.log('token', token);
    jwt.verify(token, process.env.SECRET_KEY)
    next();
    } catch(err){
        response.status(401).send({message : err.message})
    }
}