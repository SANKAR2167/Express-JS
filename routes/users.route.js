import express from "express";
import { createUser, generateHashedPassword, getUserByName } from "../services/user.service.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async function (request, response) {
    const { username, password } = request.body;
    const userFromDB = getUserByName(username);

    if (userFromDB) {
        response.status(400), send({ message: 'username already exsist' });
    } else if (password.length < 8) {
        response.status(400), send({ message: 'password must be atleast 8 characters' });
    } else {
        const hashedPassword = await generateHashedPassword(password);
        const result = await createUser({
            username: username,
            password: hashedPassword
        });
        response.send(result);
    }
});

router.post("/login", async function (request, response) {
    const { username, password } = request.body;
    const userFromDB = getUserByName(username);

    if (!userFromDB) {
        response.status(401), send({ message: 'Invalid Username' });
    } else if (password.length < 8) {
        const storeDBPassword = userFromDB.password;
        const isPasswordCheck = await bcrypt.compare(password, storeDBPassword);

        if (isPasswordCheck){
            const token = jwt.sign({id: userFromDB._id}, process.env.SECRET_KEY)
            response.send({message:'Login Successful', token : token})
        }else{
            response.status(401).send({message:'Username or Password Invalid'})
        }
    }
});

export default router;