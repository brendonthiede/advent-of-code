#!/usr/bin/env python3

from collections import deque
import os

def parse_input(filepath):
    with open(filepath, 'r') as file:
        coordinates = []
        for line in file:
            x, y = map(int, line.strip().split(','))
            coordinates.append((x, y))
        largest_value = max(max(x, y) for x, y in coordinates)
    return coordinates, largest_value + 1

def part_one(coordinates, size):
    blocked = {(x, y) for x, y in coordinates[:1024] if x < size and y < size}
    queue = deque([(0, 0, 0)])
    visited = {(0, 0)}
    
    while queue:
        x, y, steps = queue.popleft()
        if (x, y) == (size - 1, size - 1):
            return steps
            
        for dy, dx in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            new_x = x + dx
            new_y = y + dy 
            new_pos = (new_x, new_y)
            
            if (0 <= new_x < size and 0 <= new_y < size and 
                new_pos not in blocked and new_pos not in visited):
                visited.add(new_pos)
                queue.append((new_x, new_y, steps + 1))
    
    return None

def has_path_to_end(blocked_positions, size):
    start = (0, 0)
    end = (size-1, size-1)
    
    queue = deque([start])
    visited = {start}
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    
    while queue:
        x, y = queue.popleft()
        if (x, y) == end:
            return True
            
        for dy, dx in directions:
            new_x = x + dx
            new_y = y + dy
            new_pos = (new_x, new_y)
            
            if (0 <= new_x < size and 
                0 <= new_y < size and 
                new_pos not in blocked_positions and 
                new_pos not in visited):
                visited.add(new_pos)
                queue.append(new_pos)
    
    return False

def part_two(coordinates, size):
    left, right = 0, len(coordinates) - 1
    last_blocking = None
    
    while left <= right:
        mid = (left + right) // 2
        
        # Test coordinates up to mid
        test_blocked = {(x, y) for x, y in coordinates[:mid+1] if x < size and y < size}
        has_path = has_path_to_end(test_blocked, size)
                
        if has_path:
            left = mid + 1
        else:
            right = mid - 1
            last_blocking = mid
        
    # Found approximate position, now check individual coordinates
    if last_blocking is not None:
        prev_blocked = {(x, y) for x, y in coordinates[:last_blocking] if x < size and y < size}
        for x, y in coordinates[last_blocking:last_blocking+2]:
            if x >= size or y >= size:
                continue
            prev_blocked.add((x, y))
            has_path = has_path_to_end(prev_blocked, size)
            if not has_path:
                return f"{x},{y}"
            
    return None

if __name__ == "__main__":
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    coordinates, size = parse_input(input_file)
    
    part_one_answer = part_one(coordinates, size)
    print("Answer for part 1:", part_one_answer)
    
    part_two_answer = part_two(coordinates, size)
    print("Answer for part 2:", part_two_answer)
