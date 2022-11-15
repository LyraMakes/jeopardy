
export interface IParamsGameID {
    gameID: number;
}

export interface IParamsGameIDQuestion {
    gameID: number;
    ques: string;
}

export interface IGameData {
    boardData: JsonBoardData;
    teamData: {team1: string, team2: string, team3: string};
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
