#!/usr/bin/env python3

import os

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    data = [(int(line.split(":")[0]), tuple(map(int, line.split(":")[1].strip().split())))
            for line in file]

def solver(data, operator_options):
    grand_total = 0

    def try_operators(total, values, operator_options):
        def iterative_try(values, operators, current_result, index):
            if index == len(values) - 1:
              return current_result == total
            for operator in operators:
                if operator == '+':
                    new_result = current_result + values[index + 1]
                elif operator == '*':
                    new_result = current_result * values[index + 1]
                elif operator == '||':
                    new_result = int(f'{current_result}{values[index + 1]}')
                # all operators increase the value, so we can stop traversing this branch if the result is already greater than the desired total
                if new_result <= total and iterative_try(values, operators, new_result, index + 1):
                    return True
            return False
        return iterative_try(values, operator_options, values[0], 0)
    
    for total, values in data:
        if try_operators(total, values, operator_options):
            grand_total += total
    return grand_total

print("Answer for part 1:", solver(data, tuple(['+', '*'])))
print("Answer for part 2:", solver(data, tuple(['+', '*', '||'])))
