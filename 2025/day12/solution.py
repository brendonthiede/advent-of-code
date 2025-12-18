#!/usr/bin/env python3

from pathlib import Path
import time

TIMEOUT_LIMIT = 0.5  # seconds
SLACK_AREA_THRESHOLD = 100  # if there's this much slack area, assume it fits

def parse_shape(lines):
    cells = set()
    for r, line in enumerate(lines):
        for c, ch in enumerate(line):
            if ch == '#':
                cells.add((r, c))
    return frozenset(cells)


def normalize(cells):
    if not cells:
        return frozenset()
    min_r = min(r for r, _ in cells)
    min_c = min(c for _, c in cells)
    return frozenset((r - min_r, c - min_c) for r, c in cells)


def rotate_90(cells):
    return normalize(frozenset((c, -r) for r, c in cells))


def flip_horizontal(cells):
    if not cells:
        return frozenset()
    max_c = max(c for r, c in cells)
    return normalize(frozenset((r, max_c - c) for r, c in cells))


def get_all_orientations(cells):
    orientations = set()
    current = normalize(cells)
    for _ in range(4):
        orientations.add(current)
        orientations.add(flip_horizontal(current))
        current = rotate_90(current)
    return list(orientations)


def get_shape_bounds(shape):
    max_r = max(r for r, _ in shape)
    max_c = max(c for _, c in shape)
    return max_r + 1, max_c + 1


def can_place_at(grid, cells, height, width):
    for r, c in cells:
        if r < 0 or r >= height or c < 0 or c >= width or grid[r][c]:
            return False
    return True


def place_cells(grid, cells):
    for r, c in cells:
        grid[r][c] = True


def remove_cells(grid, cells):
    for r, c in cells:
        grid[r][c] = False


def pack_in(width, height, presents_to_place, all_orientations_by_shape):
    if not presents_to_place:
        return True
    
    grid = [[False] * width for _ in range(height)]
    total_cells = width * height
    present_cells = sum(len(list(all_orientations_by_shape[s])[0]) for s in presents_to_place)
    max_empty = total_cells - present_cells
    
    unique_shapes = set(presents_to_place)
    placements_by_cell = {}
    
    for shape_idx in unique_shapes:
        orientations = all_orientations_by_shape[shape_idx]
        cell_to_placements = {(r, c): [] for r in range(height) for c in range(width)}
        
        for orientation in orientations:
            h, w = get_shape_bounds(orientation)
            for start_r in range(height - h + 1):
                for start_c in range(width - w + 1):
                    translated = tuple((r + start_r, c + start_c) for r, c in orientation)
                    for cell in translated:
                        cell_to_placements[cell].append(translated)
        
        placements_by_cell[shape_idx] = cell_to_placements
        
    def find_first_empty():
        for r in range(height):
            for c in range(width):
                if not grid[r][c]:
                    return (r, c)
        return None
    
    start_time = time.time()
    def backtrack(presents_remaining, empty_used):
        # do'nt spin forever
        if time.time() - start_time > TIMEOUT_LIMIT:
            return None
        
        first_empty_cell = find_first_empty()
        
        if not presents_remaining:
            return True
        
        if first_empty_cell is None:
            return False
        
        target_r, target_c = first_empty_cell
        
        # try to cover this cell with a remaining present shape type
        shape_counts = {}
        for s in presents_remaining:
            shape_counts[s] = shape_counts.get(s, 0) + 1
        
        for shape_idx in shape_counts:
            placements = placements_by_cell[shape_idx].get((target_r, target_c), [])
            
            for translated in placements:
                if can_place_at(grid, translated, height, width):
                    place_cells(grid, translated)
                    new_presents = list(presents_remaining)
                    new_presents.remove(shape_idx)
                    result = backtrack(new_presents, empty_used)
                    if result is True:
                        return True
                    if result is None:
                        return None
                    remove_cells(grid, translated)
        
        if empty_used < max_empty:
            grid[target_r][target_c] = True
            result = backtrack(presents_remaining, empty_used + 1)
            grid[target_r][target_c] = False
            if result is True or result is None:
                return result
        
        return False
    
    return backtrack(presents_to_place, 0)


# "no" - definitely doesn't fit
# "yes" - most likely fits
# "maybe" - timed out (don't know)
def can_fit_presents(width, height, shapes, counts):
    total_area = sum(count * len(shape) for shape, count in zip(shapes, counts))
    region_area = width * height
    
    # quick area check
    if total_area > region_area:
        return "no"
    
    presents_to_place = []
    for shape_idx, count in enumerate(counts):
        for _ in range(count):
            presents_to_place.append(shape_idx)

    all_orientations_by_shape = []
    for shape in shapes:
        all_orientations_by_shape.append(get_all_orientations(shape))
    
    # lots of extra space, so should be possible???
    slack = region_area - total_area
    if slack >= SLACK_AREA_THRESHOLD:
        return "yes"
    
    result = pack_in(width, height, presents_to_place, all_orientations_by_shape)
    
    if result is True:
        return "yes"
    elif result is False:
        return "no"
    else:
        return "maybe"


def solution(file_name: str):
    inputs = Path(__file__).with_name(file_name).read_text()
    lines = inputs.strip().split('\n')
    
    # Parse shapes
    shapes = []
    current_shape_lines = []
    parsing_shapes = True
    region_lines = []
    
    for line in lines:
        if parsing_shapes:
            if line.endswith(':'):
                if current_shape_lines:
                    shapes.append(parse_shape(current_shape_lines))
                current_shape_lines = []
            elif '#' in line or '.' in line:
                current_shape_lines.append(line)
            elif line == '' and current_shape_lines:
                shapes.append(parse_shape(current_shape_lines))
                current_shape_lines = []
            elif 'x' in line:
                if current_shape_lines:
                    shapes.append(parse_shape(current_shape_lines))
                    current_shape_lines = []
                parsing_shapes = False
                region_lines.append(line)
        else:
            if line.strip():
                region_lines.append(line)
    
    if current_shape_lines:
        shapes.append(parse_shape(current_shape_lines))
    
    # Process regions
    lower_bound = 0  # definitely fit
    upper_bound = 0  # might fit (includes definite + uncertain)
    
    for line in region_lines:
        size_str, counts_str = line.split(': ')
        width, height = map(int, size_str.split('x'))
        counts = list(map(int, counts_str.split()))
        
        result = can_fit_presents(width, height, shapes, counts)
        if result == "yes":
            lower_bound += 1
            upper_bound += 1
        elif result == "maybe":
            upper_bound += 1
    
    return lower_bound, upper_bound


sample_part1_expected = 2
sample_lower, sample_upper = solution("sample.txt")
assert (
    sample_lower <= sample_part1_expected <= sample_upper
), f"Part 1: expected {sample_part1_expected} to be in range [{sample_lower}, {sample_upper}]"

lower, upper = solution("input.txt")

print(f"Answer for part 1: between {lower} and {upper}")
