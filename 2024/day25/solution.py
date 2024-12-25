#!/usr/bin/env python3

import os

def get_height(column):
    return column.count('#') - 1

def parse_schematic(text):
    rows = text.split('\n')
    cols = list(zip(*rows))
    
    heights = [get_height(col) for col in cols]
    return heights

def can_fit(lock, key):
    return all(l + k <= 5 for l, k in zip(lock, key))

def solve(filename):
    with open(filename) as f:
        schematics = f.read().strip().split('\n\n')
    
    locks = []
    keys = []
    for schematic in schematics:
        heights = parse_schematic(schematic)
        if schematic.startswith('#####'):
            locks.append(heights)
        else:
            keys.append(heights)
    
    return sum(1 for lock in locks for key in keys if can_fit(lock, key))

def main():
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    print("Answer for part 1:", solve(input_file))

if __name__ == "__main__":
    main()
