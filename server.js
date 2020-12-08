const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dataAccessLayer = require("./dataAccessLayer");
const { request } = require("http");
const { response } = require("express");
const { ObjectId, ObjectID } = require("mongodb");
dataAccessLayer.connect();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/api/games/:id", async (request, response) => {
    const gameId = request.params.id;

    if(!ObjectID.isValid(gameId)) {
        response.status(400).send(`GameId ${gameId} is incorrect.`);
        return;
    }

    const gameQuery = {
        _id: new ObjectId(gameId),
    };
    let game;
    try {
        game = await dataAccessLayer.findOne(gameQuery);
    } catch (error) {
        response.status(404).send(`Game with id ${gameId} not found!`);
        return;
    }

    response.send(game);
});

app.get("/api/games", async (request, response) => {
    const games = await dataAccessLayer.findAll();

    response.send(games);
});

app.post("/api/games", async(request, response) => {
    const body = request.body;

    if (!body.game || !body.genre || body.publisher) {
        response.status(400).send("Bad Request. Validation Error. Missing game, genre, or publisher.");
        return;

    }
    if (typeof body.game !== "string") {
        response.status(400).send("The game parameter must be of type string.");
        return;
      }
    
      if (typeof body.genre !== "string") {
        response.status(400).send("The genre parameter must be of type string.");
        return;
      }
    
      if (typeof body.publisher !== "string") {
        response.status(400).send("The publisher parameter must be of type string.");
        return;
      }
    
      await dataAccessLayer.insertOne(body);
    
      response.status(201).send();
});

app.put("/api/games/:id", async (request, response) => {
    const gameId = request.params.id;
    const body = request.body;
  
    if (!ObjectID.isValid(gameId)) {
      response.status(400).send(`PostID ${gameId} is incorrect.`);
      return;
    }
  
    if (body.game && typeof body.game !== "string") {
      response.status(400).send("The game parameter must be of type string.");
      return;
    }
  
    if (body.genre && typeof body.genre !== "string") {
      response.status(400).send("The genre parameter must be of type string.");
      return;
    }
  
    if (body.publisher && typeof body.publisher !== "string") {
      response.status(400).send("The publisher parameter must be of type string.");
      return;
    }
  
    const gameQuery = {
      _id: new ObjectId(gameId),
    };
  
    try {
      await dataAccessLayer.updateOne(gameQuery, body);
    } catch (error) {
      response.status(404).send(`Game with id ${gameId} not found!`);
      return;
    }
  
    response.send();
  });

  app.delete("/api/games/:id", async (request, response) => {
    const gameId = request.params.id;
  
    if (!ObjectID.isValid(gameId)) {
      response.status(400).send(`GameID ${gameId} is incorrect.`);
      return;
    }
  
    const gameQuery = {
      _id: new ObjectId(gameId),
    };
  
    try {
      await dataAccessLayer.deleteOne(gameQuery);
    } catch (error) {
      response.status(404).send(`Game with id ${gameId} not found!`);
      return;
    }
  
    response.send();
  });

  const port = process.env.PORT ? process.env.PORT : 3005;
app.listen(port, () => {
  console.log("API STARTED!");
});