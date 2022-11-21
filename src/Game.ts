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

    renderBoard(): string {
        return this.board.renderBoard(this.isDoubleJeopardy);
    }

    renderScore(): string {
        return this.teams.map( (team) => `<tr><td>${team.name}</td></tr><tr><td>\$${team.score}</td></tr>` ).join('');
    }

    renderQuestionTeams(): string {
        let html = "<tr>";
        for (let i = 0; i < this.teams.length; i++) {
            html += `<td class="teamName">${this.teams[i].name}</td>`;
            html += `<td class="teamScore" id="team${i}Score">${this.teams[i].score}</td>`
            html += `<td class="teamAnswer">`;
            html += `<button class="correct" id="team${i}Correct">Correct</button><br/>`;
            html += `<button class="incorrect" id="team${i}Incorrect">Incorrect</button>`;
            html += `</td>`;
        }

        html += "</tr>";

        return html;
    }

    getQuestion(question: string): string {
        let result = {question: "", answer: ""};
        let {category,questionNum} = {category: parseInt(question[1]), questionNum: parseInt(question[3])};

        
        if (this.isFinalJeopardy) {
            result.question = this.board.finalJeopardy.question;
            result.answer = this.board.finalJeopardy.answer;
        } else if (this.isDoubleJeopardy) {
            let boardQuestion = this.board.doubleJeopardy[category].questions[questionNum];
            
            result.question = boardQuestion.question;
            result.answer = boardQuestion.answer;
        } else {
            let boardQuestion = this.board.singleJeopardy[category].questions[questionNum];
            
            result.question = boardQuestion.question;
            result.answer = boardQuestion.answer;
        }

        if (result.question.startsWith("img::")) {
            result.question = `<img src="/static/${result.question.substring(5)}" />`;
        } else if (result.question.startsWith("https://") || result.question.startsWith("http://")) {
            result.question = `<img src="${result.question}" />`;
        }

        return JSON.stringify(result);
    }

    setAnswered(question: string): void {
        let result = {question: "", answer: ""};
        let {category,questionNum} = {category: parseInt(question[1]), questionNum: parseInt(question[3])};

        
        
        if (this.isDoubleJeopardy) {
            let boardQuestion = this.board.doubleJeopardy[category].questions[questionNum];
            boardQuestion.answered = true;
        } else {
            let boardQuestion = this.board.singleJeopardy[category].questions[questionNum];
            boardQuestion.answered = true;
        }

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
