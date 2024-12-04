#!/usr/bin/env python3

import os

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    inputs = file.read()

lines = inputs.splitlines()
rows = len(lines)
cols = len(lines[0])

def in_bounds(x, y):
    return 0 <= x < rows and 0 <= y < cols

def search_word_from(word, x, y, dx, dy):
    found = ""
    for i in range(len(word)):
        nx, ny = x + i * dx, y + i * dy
        if in_bounds(nx, ny):
            found += lines[nx][ny]
        if not in_bounds(nx, ny) or lines[nx][ny] != word[i]:
            return False
    return True

def part_one():
    directions = [
        (0, 1),  # horizontal right
        (0, -1),  # horizontal left
        (1, 0),  # vertical down
        (-1, 0),  # vertical up
        (-1, -1),  # diagonal up-left
        (1, 1),  # diagonal down-right
        (-1, 1),  # diagonal up-right
        (1, -1)  # diagonal down-left
    ]

    count = 0
    for r in range(rows):
        for c in range(cols):
            for dx, dy in directions:
                if search_word_from("XMAS", r, c, dx, dy):
                    count += 1
    return count

def part_two():
    count = 0
    for r in range(rows):
        for c in range(cols):
            if (
                (search_word_from("MAS", r - 1, c - 1, 1, 1) or search_word_from("MAS", r + 1, c + 1, -1, -1)) and
                (search_word_from("MAS", r + 1, c - 1, -1, 1) or search_word_from("MAS", r - 1, c + 1, 1, -1))
            ):
                count += 1
    return count

print("Answer for part 1:", part_one())
print("Answer for part 2:", part_two())
