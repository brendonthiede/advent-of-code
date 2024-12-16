#!/usr/bin/env python3

from pathlib import Path
from typing import List, Tuple
import numpy as np

OFFSET = 10_000_000_000_000

def parse_coordinates(line: str) -> Tuple[int, int]:
    """Extract X,Y coordinates from a line of input."""
    parts = line[line.find(':') + 2:].split(',')
    x = int(parts[0][parts[0].find('+') + 1:].strip())
    y = int(parts[1][parts[1].find('+') + 1:].strip())
    return x, y

def parse_prize_location(line: str) -> Tuple[int, int]:
    """Extract prize coordinates from a line of input."""
    parts = line[line.find(':') + 1:].split(',')
    x = int(parts[0][parts[0].find('=') + 1:]) + OFFSET
    y = int(parts[1][parts[1].find('=') + 1:]) + OFFSET
    return x, y

def solve_equation(btn_a: Tuple[int, int], btn_b: Tuple[int, int], 
                  prize: Tuple[int, int]) -> Tuple[float, float]:
    """Solve the system of linear equations."""
    matrix = np.array([[btn_a[0], btn_b[0]], 
                      [btn_a[1], btn_b[1]]]).astype(int)
    result = np.array([prize[0], prize[1]]).astype(int)
    return np.linalg.solve(matrix, result)

def calculate_tokens(solution: Tuple[float, float]) -> int:
    """Calculate tokens based on the solution."""
    return round(solution[0] * 3 + solution[1])

def main() -> None:
    input_path = Path(__file__).parent / "input.txt"
    with open(input_path, "r") as file:
        lines = [line.strip() for line in file]
    
    total_tokens = 0
    equations_count = round(len(lines) / 4)
    
    for i in range(equations_count):
        base_idx = i * 4
        btn_a = parse_coordinates(lines[base_idx])
        btn_b = parse_coordinates(lines[base_idx + 1])
        prize = parse_prize_location(lines[base_idx + 2])
        
        solution = solve_equation(btn_a, btn_b, prize)
        
        if np.all(np.abs(solution - np.round(solution)) < 1e-3):
            total_tokens += calculate_tokens(solution)
    
    print(total_tokens)

if __name__ == "__main__":
    main()