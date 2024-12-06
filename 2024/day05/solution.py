#!/usr/bin/env python3

import os

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    inputs = file.read()

lines = inputs.splitlines()
empty_line_index = lines.index('')

rules = [list(map(int, line.split('|'))) for line in lines[:empty_line_index]]
updates = [list(map(int, line.split(','))) for line in lines[empty_line_index + 1:]]

def is_valid_update(update, rules):
    for rule in rules:
        first, second = rule
        if first in update and second in update:
            if update.index(first) > update.index(second):
                return False
    return True

valid_updates = [update for update in updates if is_valid_update(update, rules)]
invalid_updates = [update for update in updates if not is_valid_update(update, rules)]

def fix_update(update, rules):
    while not is_valid_update(update, rules):
        update = update[:]
        for rule in rules:
            first, second = rule
            if first in update and second in update:
                first_index = update.index(first)
                second_index = update.index(second)
                if first_index > second_index:
                    update[first_index], update[second_index] = update[second_index], update[first_index]    
    return update

fixed_updates = [fix_update(update, rules) for update in invalid_updates]

def middle_number(update):
    return update[len(update) // 2]

sum_of_middle_numbers = sum([middle_number(update) for update in valid_updates])
sum_of_fixed_middle_numbers = sum([middle_number(update) for update in fixed_updates])

print("Answer for part 1:", sum_of_middle_numbers)
print("Answer for part 2:", sum_of_fixed_middle_numbers)
