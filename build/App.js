"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORT OUR DEPENDENCIES
const fastify_1 = __importDefault(require("fastify"));
const view_1 = __importDefault(require("@fastify/view"));
const liquidjs_1 = require("liquidjs");
const path_1 = __importDefault(require("path"));
const Engine_1 = require("./Engine");
// CREATE OUR SERVER OBJECT
const app = (0, fastify_1.default)({ logger: true });
const dirname = path_1.default.resolve(path_1.default.dirname(""));
// Generate Liquid Engine
const engine = new liquidjs_1.Liquid({
    root: path_1.default.join(dirname, "views"),
    extname: ".liquid",
});
// Register the engine with our fastify server
app.register(view_1.default, {
    engine: {
        liquid: engine,
    },
});
// Set base path for jeopardy app
const baseURL = "/jeopardy";
const gameEngine = new Engine_1.Engine();
// Query server if board needs to update
app.get(`${baseURL}/query/:gameID`, (req, res) => {
    const { gameID } = req.params;
    let game = gameEngine.getGame(gameID);
    if (game == null) {
        res.status(404).send({ error: "Game not found" });
    }
    else {
        res.send({ hasUpdated: game.hasUpdated ? 1 : 0 });
    }
});
app.get(`${baseURL}/game/:gameID`, (req, res) => {
    const { gameID } = req.params;
    let game = gameEngine.getGame(gameID);
    if (game == null) {
        res.status(404).send({ error: "Game not found" });
    }
    else {
        let gameBoard = game.renderBoard();
        let scoreBoard = game.renderScore();
        res.view("./views/homepage.liquid", { gameID: gameID, gameBoard: gameBoard, scoreBoard: scoreBoard });
    }
});
app.get(`${baseURL}/new`, (req, res) => {
    res.view("./views/create.liquid");
});
app.post(`${baseURL}/create`, (req, res) => {
    let { boardData, teamData } = req.body;
    let game = gameEngine.createGame(JSON.stringify(boardData));
    let { team1, team2, team3 } = teamData;
    game.AddTeam(team1);
    game.AddTeam(team2);
    game.AddTeam(team3);
    res.send({ id: game.id });
});
// GET THE SERVER LISTENING ON PORT 4000
app.listen({ host: "0.0.0.0", port: 8000 }, (err, addr) => {
    console.log(err ? err.message : `listening on ${addr}`);
});
