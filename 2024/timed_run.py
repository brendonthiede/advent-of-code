#!/usr/bin/env python3

import argparse
import glob
import os
import subprocess
import time
import termplotlib
from pathlib import Path

def count_lines(file_path):
    with open(file_path, 'r') as f:
        return sum(1 for _ in f)

def run_solution(day_path, interpreter):
    solution_path = os.path.join(day_path, "solution.py")
    if not os.path.exists(solution_path):
        return None, None
    
    start_time = time.time() * 1000
    result = subprocess.run(f'{interpreter} {solution_path}', shell=True, capture_output=True, text=True)
    end_time = time.time() * 1000
    
    return result.stdout.strip(), end_time - start_time

def create_terminal_graph(days, times, loc):
    # Time graph
    print("\nExecution Times (ms):")
    fig = termplotlib.figure()
    # Convert times to integers for display
    times_int = [int(round(t)) for t in times]
    fig.barh(times_int, labels=days)
    fig.show()
    
    # LOC graph
    print("\nLines of Code:")
    fig = termplotlib.figure()
    fig.barh(loc, labels=days)
    fig.show()

def main():
    parser = argparse.ArgumentParser(description='Run and time Advent of Code solutions')
    parser.add_argument('-v', '--verbose', action='store_true', help='Enable verbose output')
    parser.add_argument('-g', '--graph', action='store_true', help='Show terminal graphs')
    parser.add_argument('-d', '--days', nargs='+', default=['all'], help='Specific days to run (e.g., day01 day02) or "all"')
    parser.add_argument('-i', '--interpreter', help='Specify Python interpreter to use', default='python3')
    args = parser.parse_args()

    args.days = ['day{:02d}'.format(int(day)) if day.isdigit() else day for day in args.days]
    
    current_dir = Path(__file__).parent
    parent_dir = current_dir.parent.parent

    # Find all day directories
    day_paths = sorted(glob.glob(os.path.join(current_dir, "day*")))
    if args.days != ['all']:
        day_paths = [path for path in day_paths if any(day == os.path.basename(path) for day in args.days)]
    
    days = []
    times = []
    lines_of_code = []

    interpreter = args.interpreter
    print(f"Using Python interpreter: {interpreter}")
    for day_path in day_paths:
        input_path = os.path.join(day_path, "input.txt")
        if not os.path.exists(input_path) or os.path.getsize(input_path) == 0:
            continue

        solution, elapsed_time = run_solution(day_path, interpreter)
        if solution is None:
            continue

        short_path = os.path.relpath(day_path, parent_dir)
        loc = count_lines(os.path.join(day_path, "solution.py"))
        
        days.append(short_path.split('/')[-1])
        times.append(elapsed_time)
        lines_of_code.append(loc)

        if args.verbose:
            print(f"\n{day_path}")
            print(solution)
            print(f"Elapsed time: {elapsed_time:.0f} ms")
            print(f"Lines of code: {loc}")
        else:
            print(f"{short_path}: {elapsed_time:6.0f} ms {loc:4d} LoC")

    if args.graph:
        create_terminal_graph(days, times, lines_of_code)

if __name__ == "__main__":
    main()
