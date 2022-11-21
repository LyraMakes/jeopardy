"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORT OUR DEPENDENCIES
const fastify_1 = __importDefault(require("fastify"));
const view_1 = __importDefault(require("@fastify/view"));
const static_1 = __importDefault(require("@fastify/static"));
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
// Register fastify-static
app.register(static_1.default, {
    root: path_1.default.join(dirname, "static"),
    prefix: "/static/",
});
// Set base path for jeopardy app
const baseURL = "/jeopardy";
const gameEngine = new Engine_1.Engine();
// Serve static images
app.get("/static/images/:folder/:image", async (req, res) => {
    console.log(`Attempting to retrieve static/img/${req.params.folder}/${req.params.image}`);
    return res.code(200).header("Content-Type", "image/png")
        .sendFile(`/img/${req.params.folder}/${req.params.image}`);
});
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
app.get(`${baseURL}/game/:gameID/question/:ques`, (req, res) => {
    const { gameID, ques } = req.params;
    let game = gameEngine.getGame(gameID);
    if (game == null) {
        res.status(404).send({ error: "Game not found" });
    }
    else {
        let question = game.getQuestion(ques);
        let teams = game.renderQuestionTeams();
        res.view("./views/question.liquid", { gameID: gameID, questionData: question, teamData: teams, ques: ques });
    }
});
app.get(`${baseURL}/test/status`, (req, res) => {
    res.send({ status: "OK" });
});
app.post(`${baseURL}/game/:gameID/question/:ques/answer`, (req, res) => {
    const { gameID, ques } = req.params;
    const { team1, team2, team3 } = req.body;
    let game = gameEngine.getGame(gameID);
    if (game == null) {
        res.status(404).send({ error: "Game not found" });
    }
    else {
        game.teams[0].score = team1;
        game.teams[1].score = team2;
        game.teams[2].score = team3;
        game.setAnswered(ques);
    }
    res.send({ success: true });
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
app.get(`${baseURL}/admin`, (req, res) => {
    res.view("./views/admin.liquid");
});
// GET THE SERVER LISTENING ON PORT 4000
app.listen({ host: "0.0.0.0", port: 8000 }, (err, addr) => {
    console.log(err ? err.message : `listening on ${addr}`);
});
