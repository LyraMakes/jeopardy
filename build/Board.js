"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalQuestion = exports.Category = exports.Board = void 0;
const fs_1 = __importDefault(require("fs"));
class Board {
    singleJeopardy;
    doubleJeopardy;
    finalJeopardy;
    constructor(single, double, final) {
        this.singleJeopardy = single;
        this.doubleJeopardy = double;
        this.finalJeopardy = final;
    }
    renderBoard(isDouble) {
        let categories = isDouble ? this.doubleJeopardy : this.singleJeopardy;
        let cats = categories.map(({ name }) => `<th class="board-header">${name}</th>`).join('');
        let questionsList = [];
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
        return `${cats}${questionsList.join('')}`;
    }
    renderFinal(showQuestion) {
        let content = showQuestion ? this.finalJeopardy.question : this.finalJeopardy.category;
        return `<tr><td id="final${showQuestion ? "Question" : "Category"}">${content}</td></tr>`;
    }
    loadFromFile(path) {
        let categories = JSON.parse(fs_1.default.readFileSync(path, 'utf8')).board.categories;
        categories.splice(0, categories.length);
        categories.forEach((category) => {
            let newCategory = new Category(category.name);
            category.questions.forEach((question) => {
                newCategory.questions.push(new Question(question.question, question.answer));
            });
            categories.push(newCategory);
        });
    }
}
exports.Board = Board;
class Category {
    name;
    questions;
    constructor(name) {
        this.name = name;
        this.questions = [];
    }
    addQuestion(q) {
        this.questions.push(q);
    }
    static fromJSON(json) {
        let category = new Category(json.name);
        json.questions.forEach((question) => {
            category.questions.push(new Question(question.question, question.answer));
        });
        return category;
    }
}
exports.Category = Category;
class Question {
    question;
    answer;
    answered;
    constructor(ques, ans) {
        this.question = ques;
        this.answer = ans;
        this.answered = false;
    }
}
class FinalQuestion {
    category;
    question;
    answer;
    constructor(cat, ques, ans) {
        this.category = cat;
        this.question = ques;
        this.answer = ans;
    }
    renderQuestion() {
        return `<tr><td>${this.category}</td><td>${this.question}</td></tr>`;
    }
    static fromJSON(json) {
        return new FinalQuestion(json.category, json.question, json.answer);
    }
}
exports.FinalQuestion = FinalQuestion;
