#!/usr/bin/env python3

import os

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    inputs = file.read()

lines = inputs.splitlines()
rows = len(lines)
cols = len(lines[0])

def search_word_from(word, x, y, dx, dy):
    for i in range(len(word)):
        nx, ny = x + i * dx, y + i * dy
        
        if 0 > nx or nx >= rows or \
            0 > ny or ny >= cols or \
                lines[nx][ny] != word[i]:
            return False
    return True

def search_word_from_bidirectional(word, x, y, dx, dy):
    return search_word_from(word, x, y, dx, dy) or \
        search_word_from(word[::-1], x, y, dx, dy)

def part_one():
    directions = [
        (0, 1),  # - horizontal
        (1, 0),  # | vertical
        (1, 1),  # \ diagonal down-right
        (-1, 1)  # / diagonal up-right
    ]

    count = 0
    for r in range(rows):
        for c in range(cols):
            for dx, dy in directions:
                if search_word_from_bidirectional("XMAS", r, c, dx, dy):
                    count += 1
    return count

def part_two():
    count = 0
    for r in range(rows):
        for c in range(cols):
            if search_word_from_bidirectional("MAS", r - 1, c - 1, 1, 1) and \
               search_word_from_bidirectional("MAS", r + 1, c - 1, -1, 1):
                count += 1
    return count

print("Answer for part 1:", part_one())
print("Answer for part 2:", part_two())
