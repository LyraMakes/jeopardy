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
    renderBoard() {
        if (!this.isDoubleJeopardy)
            this.isDoubleJeopardy = this.board.checkComplete(false);
        if (!this.isFinalJeopardy && this.isDoubleJeopardy)
            this.isFinalJeopardy = this.board.checkComplete(true);
        return this.board.renderBoard(this.isDoubleJeopardy);
    }
    renderScore() {
        return this.teams.map((team) => `<tr><td>${team.name}</td></tr><tr><td>\$${team.score}</td></tr>`).join('');
    }
    renderQuestionTeams() {
        let html = "<tr>";
        for (let i = 0; i < this.teams.length; i++) {
            html += `<td class="teamName">${this.teams[i].name}</td>`;
            html += `<td class="teamScore" id="team${i}Score">${this.teams[i].score}</td>`;
            html += `<td class="teamAnswer">`;
            html += `<button class="correct" id="team${i}Correct" onclick="teamAnswered(${i + 1}, true)">Correct</button><br/>`;
            html += `<button class="incorrect" id="team${i}Incorrect" onclick="teamAnswered(${i + 1}, false)">Incorrect</button>`;
            html += `</td>`;
        }
        html += `<td class="exit"><button class="exitButton" onclick="submitScores()">BACK</button></td>`;
        html += "</tr>";
        return html;
    }
    getQuestion(question) {
        let result = { question: "", answer: "", value: 0 };
        let { category, questionNum } = { category: parseInt(question[1]), questionNum: parseInt(question[3]) };
        if (this.isFinalJeopardy) {
            result.question = this.board.finalJeopardy.question;
            result.answer = this.board.finalJeopardy.answer;
        }
        else if (this.isDoubleJeopardy) {
            let boardQuestion = this.board.doubleJeopardy[category].questions[questionNum];
            result.question = boardQuestion.question;
            result.answer = boardQuestion.answer;
            result.value = (questionNum + 1) * 400;
        }
        else {
            let boardQuestion = this.board.singleJeopardy[category].questions[questionNum];
            result.question = boardQuestion.question;
            result.answer = boardQuestion.answer;
            result.value = (questionNum + 1) * 200;
        }
        if (result.question.startsWith("img::")) {
            result.question = `<img src="/static/images/${result.question.substring(5)}" />`;
        }
        else if (result.question.startsWith("https://") || result.question.startsWith("http://")) {
            result.question = `<img src="${result.question}" />`;
        }
        return JSON.stringify(result);
    }
    setAnswered(question) {
        let result = { question: "", answer: "" };
        let { category, questionNum } = { category: parseInt(question[1]), questionNum: parseInt(question[3]) };
        if (this.isDoubleJeopardy) {
            let boardQuestion = this.board.doubleJeopardy[category].questions[questionNum];
            boardQuestion.answered = true;
        }
        else {
            let boardQuestion = this.board.singleJeopardy[category].questions[questionNum];
            boardQuestion.answered = true;
        }
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
