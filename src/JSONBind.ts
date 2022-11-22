
export interface IParamsGameID {
    gameID: number;
}

export interface IScoreBoardData {
    names: string;
    scores: string;
}

export interface IParamsGameIDQuestion {
    gameID: number;
    ques: string;
}

export interface IImageData {
    folder: string;
    image: string;
}

export interface IGameData {
    boardData: JsonBoardData;
    teamData: {team1: string, team2: string, team3: string};
}

export interface IAnswerData {
    team1: number;
    team2: number;
    team3: number;
}

export interface JsonCategory {
    name: string;
    questions: JsonQuestion[];
}

export interface JsonQuestion {
    question: string;
    answer: string;
}


export interface JsonBoardData {
    single: { categories: JsonCategory[] };
    double: { categories: JsonCategory[] };
    final: { category: string, question: string, answer: string };
}
