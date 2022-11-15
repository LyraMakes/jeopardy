#!/usr/bin/env python3
import requests
import json

baseURL = "http://localhost:8000/dev/jeopardy"


def createGame(session: requests.Session) -> int:
    gameData = json.loads(session.get(f"{baseURL}/new").text)

    try:
        gameId = int(gameData["gameId"])
    except ValueError as e:
        print(f"`{baseURL}/new` did not return a valid game ID")
        raise e
    
    return gameId


def joinGame(team: int, name: str, password: str):
    payload = {
        "teamNum": team,
        "teamName": name,
        "passkey": password
    }

    requests.post(f"{baseURL}/join")
    
    pass

def main():
    # Create Game
    gameSession = requests.Session()

    gameID = createGame(gameSession)

    # Add Teams




    pass


if __name__ == "__main__":
    main()
