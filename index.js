// const express = require("express"); // 3rd party package imported
import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
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

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.get("/movies", async function (request, response) {

  if (request.query.rating){
    request.query.rating = +request.query.rating;
  }

  console.log(request.query);
  const movies = await client.db('local').collection('movies').find(request.query).toArray();
  console.log(movies);
  response.send(movies);
});

app.get("/movies/:id", async function (request, response) {
  const { id } = request.params;
  // console.log(request.params, id);
  // const movie = movies.find((mv) => mv.id === id);
  const movie = await client.db('local').collection('movies').findOne({ id: id });
  console.log(movie);
  movie ? response.send(movie) : response.status(404).send({ message: 'movie not found' });
});

app.post("/movies", async function (request, response) {
  const data = request.body;
  console.log(data);
  const result = await client.db('local').collection('movies').insertMany(data);
  response.send(result);
});

app.delete("/movies/:id", async function (request, response) {
  const { id } = request.params;
  // console.log(request.params, id);
  // const movie = movies.find((mv) => mv.id === id);
  const result = await client.db('local').collection('movies').deleteOne({ id: id });
  console.log(result);
  result.deletedCount > 0 ? response.send({message: "movie deleted successfully"}) : response.status(404).send({ message: 'movie not found' });
});

app.put("/movies/:id", async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  const result = await client
  .db('local')
  .collection('movies')
  .updateOne({ id: id }, {$set: data});
  console.log(result);
  response.send(result);
});


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`)); // start the app
