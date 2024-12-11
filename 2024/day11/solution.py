#!/usr/bin/env python3

import os
from functools import lru_cache

def transform_stones(stones):
    new_stones = []
    
    for stone in stones:
        # Rule 1: If stone is 0, replace with 1
        if stone == 0:
            new_stones.append(1)
            
        # Rule 2: If even number of digits, split in half
        elif len(str(stone)) % 2 == 0:
            digits = str(stone)
            mid = len(digits) // 2
            left = int(digits[:mid])
            right = int(digits[mid:])
            new_stones.extend([left, right])
            
        # Rule 3: Multiply by 2024
        else:
            new_stones.append(stone * 2024)
    
    return new_stones

@lru_cache(maxsize=None)
def transform_stone(stone):
    new_stones = []
    
    # Rule 1: If stone is 0, replace with 1
    if stone == 0:
        new_stones.append(1)
        
    # Rule 2: If even number of digits, split in half
    elif len(str(stone)) % 2 == 0:
        digits = str(stone)
        mid = len(digits) // 2
        left = int(digits[:mid])
        right = int(digits[mid:])
        new_stones.extend([left, right])
        
    # Rule 3: Multiply by 2024
    else:
        new_stones.append(stone * 2024)
    
    return new_stones

def transform_stones(stone_counts):
    new_counts = {}
    for stone, count in stone_counts.items():
        for new_stone in transform_stone(stone):
            new_counts[new_stone] = new_counts.get(new_stone, 0) + count
    return new_counts

def solve(initial_stones, blinks):
    stone_counts = {}
    for stone in initial_stones:
        stone_counts[stone] = 1
    
    for _ in range(blinks):
        stone_counts = transform_stones(stone_counts)
    
    return sum(stone_counts.values())

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    initial_stones = [int(x) for x in file.read().split()]

print("Answer for part 1:", solve(initial_stones, 25))
print("Answer for part 2:", solve(initial_stones, 75))
