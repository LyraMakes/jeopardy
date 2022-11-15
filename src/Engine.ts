import { Game } from "./Game";

export class Engine {
    games: Game[];

    constructor() {
        this.games = [];
    }

    createGame(boardData: string): Game {
        let game = new Game(this.getId(), boardData);
        this.games.push(game);
        return game;
    }

    getGame(id: number): Game | null {
        for (let i = 0; i < this.games.length; i++) {
            if (this.games[i].id == id) {
                return this.games[i];
            }
        }

        return null;
    }

    getId(): number {
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