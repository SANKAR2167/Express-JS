// const express = require("express"); // 3rd party package imported
import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
import moviesRouter from './routes/movies.route.js';
import userRouter from './routes/users.route.js';
import cors from 'cors';

dotenv.config();


const app = express();

const PORT = process.env.PORT;

// connection
//  const MONGO_URL = 'mongodb://127.0.0.1';
const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL);
await client.connect();
console.log('mongo is connected');

app.use(express.json());
app.use(cors());

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

// Route Setup
app.use('/movies', moviesRouter);
app.use('/user', userRouter);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`)); // start the app

export {client};