import express from "express";

const router = express.Router();

router.get("/movies", async function (request, response) {

    if (request.query.rating) {
        request.query.rating = +request.query.rating;
    }

    console.log(request.query);
    const movies = await client.db('local').collection('movies').find(request.query).toArray();
    console.log(movies);
    response.send(movies);
});

router.get("/movies/:id", async function (request, response) {
    const { id } = request.params;
    // console.log(request.params, id);
    // const movie = movies.find((mv) => mv.id === id);
    const movie = await client.db('local').collection('movies').findOne({ id: id });
    console.log(movie);
    movie ? response.send(movie) : response.status(404).send({ message: 'movie not found' });
});

router.post("/movies", async function (request, response) {
    const data = request.body;
    console.log(data);
    const result = await client.db('local').collection('movies').insertMany(data);
    response.send(result);
});

router.delete("/movies/:id", async function (request, response) {
    const { id } = request.params;
    // console.log(request.params, id);
    // const movie = movies.find((mv) => mv.id === id);
    const result = await client.db('local').collection('movies').deleteOne({ id: id });
    console.log(result);
    result.deletedCount > 0 ? response.send({ message: "movie deleted successfully" }) : response.status(404).send({ message: 'movie not found' });
});

router.put("/movies/:id", async function (request, response) {
    const { id } = request.params;
    const data = request.body;
    const result = await client
        .db('local')
        .collection('movies')
        .updateOne({ id: id }, { $set: data });
    console.log(result);
    response.send(result);
});

export default router;