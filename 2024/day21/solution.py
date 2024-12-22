#!/usr/bin/env python3

from itertools import permutations
import os
from typing import Dict, List, Tuple

# Define positions for all buttons using (x, y) tuples
POSITIONS = {
    # Numeric keypad positions
    '7': (0, 0), '8': (0, 1), '9': (0, 2),
    '4': (1, 0), '5': (1, 1), '6': (1, 2),
    '1': (2, 0), '2': (2, 1), '3': (2, 2),
    '0': (3, 1), 'A': (3, 2),
    # Directional keypad positions
    '^': (0, 1), 'a': (0, 2),  # 'a' represents 'A' on directional pad
    '<': (1, 0), 'v': (1, 1), '>': (1, 2)
}

DIRECTIONS = {
    '^': (-1, 0),
    'v': (1, 0),
    '<': (0, -1),
    '>': (0, 1)
}

# Memoization cache
move_cache: Dict[Tuple[str, int, int], int] = {}

def add_pos(p1: Tuple[int, int], p2: Tuple[int, int]) -> Tuple[int, int]:
    return (p1[0] + p2[0], p1[1] + p2[1])

def sub_pos(p1: Tuple[int, int], p2: Tuple[int, int]) -> Tuple[int, int]:
    return (p1[0] - p2[0], p1[1] - p2[1])

def generate_moves(start: Tuple[int, int], end: Tuple[int, int], avoid: Tuple[int, int]) -> List[str]:
    dy, dx = sub_pos(end, start)
    moves = []
    
    # Generate basic moves sequence
    if dy < 0:
        moves.extend(['^'] * abs(dy))
    else:
        moves.extend(['v'] * dy)
    if dx < 0:
        moves.extend(['<'] * abs(dx))
    else:
        moves.extend(['>'] * dx)
    
    # Generate all valid permutations
    result = []
    for perm in set(permutations(moves)):
        pos = start
        valid = True
        for move in perm:
            pos = add_pos(pos, DIRECTIONS[move])
            if pos == avoid:
                valid = False
                break
        if valid:
            result.append(''.join(perm) + 'a')
    
    return result if result else ['a']

def find_shortest(sequence: str, number_of_robots: int, depth: int) -> int:
    # Check cache
    key = (sequence, depth, number_of_robots)
    if key in move_cache:
        return move_cache[key]
    
    # Set starting position and gap to avoid
    avoid = (3, 0) if depth == 0 else (0, 0)
    curr = POSITIONS['A'] if depth == 0 else POSITIONS['a']
    total_length = 0
    
    # Process each character in sequence
    for char in sequence:
        target = POSITIONS[char]
        moves = generate_moves(curr, target, avoid)
        
        if depth == number_of_robots:
            total_length += len(min(moves, key=len))
        else:
            total_length += min(find_shortest(move, number_of_robots, depth + 1) for move in moves)
        curr = target
    
    move_cache[key] = total_length
    return total_length

def calculate_sequence_complexity(code: str, number_of_robots: int) -> int:
    """Calculate complexity for a code sequence"""
    move_cache.clear()
    length = find_shortest(code, number_of_robots, 0)
    return length * int(code[:-1])

def solve(codes: List[str], number_of_robots: int) -> Tuple[int, int]:
    total = 0
    for code in codes:
        complexity = calculate_sequence_complexity(code, number_of_robots)
        total += complexity
    return total

def main():
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    codes = [line.strip() for line in open(input_file)]
    
    print("Answer for part 1:", solve(codes, 2))
    print("Answer for part 2:", solve(codes, 25))

if __name__ == "__main__":
    main()
