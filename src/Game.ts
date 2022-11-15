import { Board, Category, FinalQuestion } from "./Board";
import { JsonBoardData } from "./JSONBind";


export class Game {
    id: number;

    hasUpdated: boolean;

    isDoubleJeopardy: boolean;
    isFinalJeopardy: boolean;

    teams: Team[];

    board: Board;

    constructor(id: number, boardData: string) {
        this.id = id;
        this.teams = [];


        let jsonBoardData: JsonBoardData = JSON.parse(boardData);

        let single: Category[] = [];
        jsonBoardData.single.categories.forEach( (category) => {
            single.push(Category.fromJSON(category));
        });

        let double: Category[] = [];
        jsonBoardData.double.categories.forEach( (category) => {
            double.push(Category.fromJSON(category));
        });

        let final: FinalQuestion = FinalQuestion.fromJSON(jsonBoardData.final);

        this.board = new Board(single, double, final);

        this.hasUpdated = false;
        this.isDoubleJeopardy = false;
        this.isFinalJeopardy = false;
    }

    AddTeam(team: string | Team): void {
        this.teams.push((typeof team == "string") ? new Team(team) : team);
    }


    genNewTeamId(): number {
        // TODO - Finish genNewTeamId
        return -1;
    }

    renderBoard(): string {
        return this.board.renderBoard(this.isDoubleJeopardy);
    }

    renderScore(): string {
        return this.teams.map( (team) => `<tr><td>${team.name}</td></tr><tr><td>\$${team.score}</td></tr>` ).join('');
    }
}


class Team {
    name: string;
    score: number;

    constructor(name: string) {
        this.name = name;
        this.score = 0;
    }

}
