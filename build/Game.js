"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Board_1 = require("./Board");
class Game {
    id;
    hasUpdated;
    isDoubleJeopardy;
    isFinalJeopardy;
    teams;
    board;
    constructor(id, boardData) {
        this.id = id;
        this.teams = [];
        let jsonBoardData = JSON.parse(boardData);
        let single = [];
        jsonBoardData.single.categories.forEach((category) => {
            single.push(Board_1.Category.fromJSON(category));
        });
        let double = [];
        jsonBoardData.double.categories.forEach((category) => {
            double.push(Board_1.Category.fromJSON(category));
        });
        let final = Board_1.FinalQuestion.fromJSON(jsonBoardData.final);
        this.board = new Board_1.Board(single, double, final);
        this.hasUpdated = false;
        this.isDoubleJeopardy = false;
        this.isFinalJeopardy = false;
    }
    AddTeam(team) {
        this.teams.push((typeof team == "string") ? new Team(team) : team);
    }
    genNewTeamId() {
        // TODO - Finish genNewTeamId
        return -1;
    }
    renderBoard() {
        return this.board.renderBoard(this.isDoubleJeopardy);
    }
    renderScore() {
        return this.teams.map((team) => `<tr><td>${team.name}</td></tr><tr><td>\$${team.score}</td></tr>`).join('');
    }
}
exports.Game = Game;
class Team {
    name;
    score;
    constructor(name) {
        this.name = name;
        this.score = 0;
    }
}
