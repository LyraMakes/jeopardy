import fs from "fs";

import { JsonCategory, JsonQuestion } from "./JSONBind";


export class Board {
    singleJeopardy: Category[];
    doubleJeopardy: Category[];
    finalJeopardy: FinalQuestion;

    constructor(single: Category[], double: Category[], final: FinalQuestion) {
        this.singleJeopardy = single;
        this.doubleJeopardy = double;
        this.finalJeopardy = final;
    }

    renderBoard(isDouble: boolean): string {
        let categories = isDouble ? this.doubleJeopardy : this.singleJeopardy;

        let cats = categories.map( ( {name} ) => `<th class="board-header">${name}</th>` ).join('');
        let questionsList = []

        let numCategories = categories.length;
        let numQuestions = categories[0].questions.length;

        let initValue = 200 * (isDouble ? 2 : 1);

        for (let i = 0; i < numQuestions; i++) {
            questionsList.push("<tr class=\"board-row\">");
            for (let j = 0; j < numCategories; j++) {
                questionsList.push(`<td class="board-value" onclick="boardClick(${i},${j})">\$${initValue * (i + 1)}</td>`);
            }
            questionsList.push("</tr>");
        }

        return `${cats}${questionsList.join('')}` 
    }

    renderFinal(showQuestion: boolean): string {
        let content = showQuestion ? this.finalJeopardy.question : this.finalJeopardy.category;
        return `<tr><td id="final${showQuestion ? "Question" : "Category"}">${content}</td></tr>`
    }

    loadFromFile(path: string): void {
        let categories = JSON.parse(fs.readFileSync(path, 'utf8')).board.categories;

        categories.splice(0, categories.length);

        categories.forEach((category: JsonCategory) => {
            let newCategory = new Category(category.name);

            category.questions.forEach( (question: JsonQuestion) => {
                newCategory.questions.push(new Question(question.question, question.answer));
            });
            

            categories.push(newCategory);
        });
    }

    
}

export class Category {
    name: string;

    questions: Question[];

    constructor(name:string) {
        this.name = name;
        this.questions = [];
    }

    addQuestion(q: Question): void {
        this.questions.push(q);
    }

    static fromJSON(json: JsonCategory): Category {
        let category = new Category(json.name);

        json.questions.forEach( (question: JsonQuestion) => {
            category.questions.push(new Question(question.question, question.answer));
        });

        return category;
    }
}

class Question {
    question: string;
    answer: string;

    answered: boolean;

    constructor(ques: string, ans: string) {
        this.question = ques;
        this.answer = ans;

        this.answered = false;
    }
}

export class FinalQuestion {
    category: string;
    question: string;
    answer: string;

    constructor(cat: string, ques: string, ans: string) {
        this.category = cat;
        this.question = ques;
        this.answer = ans;
    }

    renderQuestion(): string {
        return `<tr><td>${this.category}</td><td>${this.question}</td></tr>`;
    }

    static fromJSON(json: any): FinalQuestion {
        return new FinalQuestion(json.category, json.question, json.answer);
    }
}