"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const Game_1 = require("./Game");
class Engine {
    games;
    constructor() {
        this.games = [];
    }
    createGame(boardData) {
        let game = new Game_1.Game(this.getId(), boardData);
        this.games.push(game);
        return game;
    }
    getGame(id) {
        for (let i = 0; i < this.games.length; i++) {
            if (this.games[i].id == id) {
                return this.games[i];
            }
        }
        return null;
    }
    getId() {
        while (true) {
            let id = Math.floor(Math.random() * 100000);
            let willWork = true;
            for (let i = 0; i < this.games.length; i++) {
                if (this.games[i].id == id) {
                    willWork = false;
                }
            }
            if (willWork) {
                return id;
            }
        }
    }
}
exports.Engine = Engine;
