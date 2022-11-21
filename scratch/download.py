#!/usr/bin/env python3
import requests


def dlimg(url: str, fname: str) -> None:
    with open(fname, "wb") as file:
        file.write(requests.get(url).content)


def main() -> None:
    content = []
    with open("Sorting.txt", "r") as f:
        content = f.readlines()

    for i, url in enumerate(content):
        dlimg(url, f"{i}.png")


if __name__ == "__main__":
    main()

