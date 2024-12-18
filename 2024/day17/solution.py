#!/usr/bin/env python3

import os
from dataclasses import dataclass

@dataclass
class Computer:
    reg_a: int = 0
    reg_b: int = 0
    reg_c: int = 0
    outputs: list = None
    
    def __post_init__(self):
        self.outputs = []
    
    def get_combo_value(self, operand):
        if operand <= 3:
            return operand
        elif operand == 4:
            return self.reg_a
        elif operand == 5:
            return self.reg_b
        elif operand == 6:
            return self.reg_c
    
    def execute(self, program):
        ip = 0
        while ip < len(program):
            opcode = program[ip]
            operand = program[ip + 1]
            
            if opcode == 0:  # adv - A DiVide: divide register A by 2^(combo operand)
                self.reg_a //= (1 << self.get_combo_value(operand))
            elif opcode == 1:  # bxl - B Xor Literal: XOR register B with literal operand
                self.reg_b ^= operand
            elif opcode == 2:  # bst - B SeT: set register B to combo operand mod 8 (one octal digit)
                self.reg_b = self.get_combo_value(operand) % 8
            elif opcode == 3:  # jnz - Jump if Not Zero: jump to operand if A is not zero
                if self.reg_a != 0:
                    ip = operand
                    continue
            elif opcode == 4:  # bxc - B Xor C: XOR register B with register C
                self.reg_b ^= self.reg_c
            elif opcode == 5:  # out - OUTput: output combo operand mod 8 (one octal digit)
                # combined with adv (divide by 8), outputs one octal digit at a time from register A
                self.outputs.append(self.get_combo_value(operand) % 8)
            elif opcode == 6:  # bdv - B DiVide: divide A by 2^(combo operand), store in B
                self.reg_b = self.reg_a // (1 << self.get_combo_value(operand))
            elif opcode == 7:  # cdv - C DiVide: divide A by 2^(combo operand), store in C
                self.reg_c = self.reg_a // (1 << self.get_combo_value(operand))
            
            ip += 2

def parse_input(filepath):
    with open(filepath, 'r') as file:
        lines = file.readlines()
        
    reg_a = int(lines[0].split(": ")[1])
    reg_b = int(lines[1].split(": ")[1])
    reg_c = int(lines[2].split(": ")[1])
    
    # Remove "Program: " prefix and split the comma-separated numbers
    program_str = lines[4].split(": ")[1].strip()
    program = [int(x) for x in program_str.split(",")]
    return reg_a, reg_b, reg_c, program

def part_one(computer: Computer, program):
    computer.execute(program)
    return ','.join(map(str, computer.outputs))

def find_initial_a(program, execution_position, incoming_test_value):
    for digit in range(8):
        test_value = incoming_test_value * 8 + digit  # add new octal digit to the test value
        computer = Computer(test_value, 0, 0)
        computer.execute(program)

        # check if we've matched the program up to this point        
        if computer.outputs != program[execution_position:]:
            continue

        if execution_position == 0:  # we've matched everything
            return test_value

        # try to match rest of program
        result = find_initial_a(program, execution_position - 1, test_value)
        if result is not None:
            return result
    return None

if __name__ == "__main__":
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    reg_a, reg_b, reg_c, program = parse_input(input_file)
    computer = Computer(reg_a, reg_b, reg_c)

    part_one_answer = part_one(computer, program)
    print("Answer for part 1:", part_one_answer)
    
    part_two_answer =find_initial_a(program, len(program) - 1, 0)
    print("Answer for part 2:", part_two_answer)
