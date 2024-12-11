#!/usr/bin/env python3

import os

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

def solve(initial_stones, blinks):
    stones = initial_stones.copy()
    
    for _ in range(blinks):
        stones = transform_stones(stones)
    return len(stones)

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    initial_stones = [int(x) for x in file.read().split()]

print("Answer for part 1:", solve(initial_stones, 25))
print("Answer for part 1:", solve(initial_stones, 75))
