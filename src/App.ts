// IMPORT OUR DEPENDENCIES
import fastify from "fastify";
import fastify_view from "@fastify/view";
import fastify_static from "@fastify/static";
import { Liquid } from "liquidjs";
import path from "path";

// User imports
import { Game } from "./Game";
import { Board } from "./Board";
import { Engine } from "./Engine";

import { IAnswerData, IGameData, IImageData, IParamsGameID, IParamsGameIDQuestion } from "./JSONBind";

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

// Register fastify-static
app.register(fastify_static, {
  root: path.join(dirname, "static"),
  prefix: "/static/",
})

// Set base path for jeopardy app
const baseURL = "/jeopardy";
const gameEngine = new Engine();


// Serve static images
app.get<{Params: IImageData}>("/static/images/:folder/:image", async (req, res) => {  
  return res.code(200).header("Content-Type", "image/png")
    .sendFile(`static/img/${req.params.folder}/${req.params.image}`);
})

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


app.get<{Params: IParamsGameIDQuestion}>(`${baseURL}/game/:gameID/question/:ques`, (req, res) => {
  const { gameID, ques } = req.params;
  let game = gameEngine.getGame(gameID);
  if (game == null) {
      res.status(404).send({error: "Game not found"});
  } else {
      let question = game.getQuestion(ques);
      let teams = game.renderQuestionTeams();

      res.view("./views/question.liquid", { gameID: gameID, questionData: question, teamData: teams })
  }
});


app.get(`${baseURL}/test/status`, (req, res) => {
  res.send({ status: "OK" })
});


app.post<{Params: IParamsGameIDQuestion, Body: IAnswerData}>(`${baseURL}/game/:gameID/question/:ques/answer`, (req, res) => {
  const { gameID, ques } = req.params;
  const { team1, team2, team3} = req.body;

  let game = gameEngine.getGame(gameID);
  if (game == null) {
      res.status(404).send({error: "Game not found"});
  } else {
    game.teams[0].score = team1;
    game.teams[1].score = team2;
    game.teams[2].score = team3;

    game.setAnswered(ques);
  }

  res.send({success: true});

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
