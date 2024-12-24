#!/usr/bin/env python3

import os

class Circuit:
    def __init__(self):
        self.wires = {}
        self.gates = []
        
    def add_wire(self, name, value):
        self.wires[name] = int(value)
        
    def add_gate(self, gate_type, input1, input2, output):
        self.gates.append((gate_type, input1, input2, output))
        
    def evaluate_gate(self, gate_type, input1, input2):
        if gate_type == "AND":
            return input1 & input2
        elif gate_type == "OR":
            return input1 | input2
        elif gate_type == "XOR":
            return input1 ^ input2
        
    def simulate(self):
        changed = True
        while changed:
            changed = False
            for gate_type, in1, in2, out in self.gates:
                if out not in self.wires and in1 in self.wires and in2 in self.wires:
                    self.wires[out] = self.evaluate_gate(gate_type, self.wires[in1], self.wires[in2])
                    changed = True

def parse_input(filename):
    circuit = Circuit()
    with open(filename) as f:
        line = f.readline().strip()
        while line:
            if ':' in line:
                wire, value = line.split(':')
                circuit.add_wire(wire.strip(), value.strip())
            else:
                while line:
                    if not line.strip():
                        line = f.readline()
                        continue
                    parts = line.strip().split()
                    input1, gate_type, input2 = parts[0:3]
                    output = parts[-1]
                    circuit.add_gate(gate_type, input1, input2, output)
                    line = f.readline()
            line = f.readline()
    return circuit

def part1(circuit):
    # Get all z-wires and their values, sorted in DESCENDING order
    z_wires = sorted([(k, v) for k, v in circuit.wires.items() if k.startswith('z')],
                    key=lambda x: -int(x[0][1:]))
    
    # Combine into binary number
    binary = ''.join(str(v) for _, v in z_wires)
    return int(binary, 2)

def part2(circuit):
    swaps = []
    
    # every z wire should be the output of an XOR, except for the most significant bit (z45)
    swaps.extend(out for gate_type, _, _, out in circuit.gates if out.startswith('z') and gate_type != 'XOR' and out != 'z45')
    
    # all the XOR operations should have either an x wire for input, a y wire for input, or a z wire for output.
    swaps.extend(out for gate_type, in1, _, out in circuit.gates if gate_type == 'XOR' and not (in1.startswith('x') or in1.startswith('y')) and not out.startswith('z'))
    
    # input of an OR should be the output of an AND, except for the least significant bit (x00, y00)
    or_outputs = {in1 if gate_type == 'OR' else in2 for gate_type, in1, in2, _ in circuit.gates if gate_type == 'OR'}
    and_outputs = {out for gate_type, _, _, out in circuit.gates if gate_type == 'AND' and out not in {'x00', 'y00'}}
    swaps.extend(or_outputs - and_outputs)

    return ','.join(sorted(set(swaps)))

def main():
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    circuit = parse_input(input_file)
    circuit.simulate()
    
    print("Answer for part 1:", part1(circuit))
    print("Answer for part 2:", part2(circuit))

if __name__ == "__main__":
    main()
