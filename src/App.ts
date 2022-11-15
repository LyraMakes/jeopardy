// IMPORT OUR DEPENDENCIES
import fastify from "fastify";
import fastify_view from "@fastify/view";
import { Liquid } from "liquidjs";
import path from "path";

// User imports
import { Game } from "./Game";
import { Board } from "./Board";
import { Engine } from "./Engine";

import { IGameData, IParamsGameID } from "./JSONBind";

// CREATE OUR SERVER OBJECT
const app = fastify({ logger: true })
const dirname = path.resolve(path.dirname(""))

// Generate Liquid Engine
const engine = new Liquid({
  root: path.join(dirname, "views"),
  extname: ".liquid",
})

// Register the engine with our fastify server
app.register(fastify_view, {
  engine: {
    liquid: engine,
  },
})

// Set base path for jeopardy app
const baseURL = "/jeopardy";
const gameEngine = new Engine();


// Query server if board needs to update
app.get<{Params: IParamsGameID}>(`${baseURL}/query/:gameID`, (req, res) => {
    const { gameID } = req.params;

    let game = gameEngine.getGame(gameID);

    if (game == null) {
        res.status(404).send({error: "Game not found"});
    } else {
        res.send({ hasUpdated: game.hasUpdated ? 1 : 0 })
    }

    
});



app.get<{Params: IParamsGameID}>(`${baseURL}/game/:gameID`, (req, res) => {
  const { gameID } = req.params;
  let game = gameEngine.getGame(gameID);
  if (game == null) {
      res.status(404).send({error: "Game not found"});
  } else {
      let gameBoard = game.renderBoard();
      let scoreBoard = game.renderScore();

      res.view("./views/homepage.liquid", { gameID: gameID, gameBoard: gameBoard, scoreBoard: scoreBoard })
  }
});



app.get(`${baseURL}/new`, (req, res) => {
    res.view("./views/create.liquid");  
});



app.post<{ Body: IGameData }>(`${baseURL}/create`, (req, res) => {
    let {boardData, teamData} = req.body;

    let game = gameEngine.createGame(JSON.stringify(boardData));

    let {team1, team2, team3} = teamData;
    
    game.AddTeam(team1);
    game.AddTeam(team2);
    game.AddTeam(team3);

    res.send({id: game.id});
});





// GET THE SERVER LISTENING ON PORT 4000
app.listen({host: "0.0.0.0", port: 8000}, (err, addr) => {
  console.log(err ? err.message : `listening on ${addr}`)
})
