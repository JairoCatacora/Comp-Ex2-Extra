class TransitionTable:
    
    def __init__(self, input_string, lr_table):
        self.input_string = input_string.strip()
        self.lr_table = lr_table
        self.tokens = self._tokenize_input()
        self.stack = [0]
        self.input_buffer = list(self.tokens) + ['$']
        self.current_position = 0  # Track position in original input
        self.transitions = []
        self.accepted = False
        self.error_message = None
        self.step_count = 0
        self.max_steps = 1000
        
        self._process_string()
    
    def _tokenize_input(self):
        if not self.input_string:
            return []
        return self.input_string.split()
    
    def _process_string(self):
        while self.step_count < self.max_steps:
            self.step_count += 1
            
            current_state = self.stack[-1]
            current_input = self.input_buffer[0] if self.input_buffer else '$'
            
            action = self.lr_table.get_action(current_state, current_input)
            
            if not action:
                self._record_error(f"No hay acción definida para estado {current_state} con símbolo '{current_input}'")
                break
            
            action_type, value = action
            
            if action_type == 'shift':
                self._perform_shift(value, current_input)
            elif action_type == 'reduce':
                self._perform_reduce(value)
            elif action_type == 'accept':
                self._perform_accept()
                break
            else:
                self._record_error(f"Acción desconocida: {action_type}")
                break
        
        if self.step_count >= self.max_steps:
            self._record_error("Se alcanzó el límite máximo de pasos")
    
    def _perform_shift(self, next_state, symbol):
        self.stack.append(next_state)
        self.input_buffer.pop(0)
        self.current_position += 1  # Update position when consuming input
        
        self.transitions.append({
            'step': self.step_count,
            'action': f'shift {next_state}',
            'stack': list(self.stack),
            'input': list(self.input_buffer),
            'symbol': symbol,
            'position': self.current_position
        })
    
    def _perform_reduce(self, rule_number):
        if rule_number >= len(self.lr_table.grammar.reglas):
            self._record_error(f"Número de regla inválido: {rule_number}")
            return
        
        rule = self.lr_table.grammar.reglas[rule_number]
        left_side, right_side = rule.split(' -> ')
        
        symbols = right_side.split() if right_side.strip() else []
        
        if symbols and symbols[0] != 'ε':
            for _ in range(len(symbols)):
                if len(self.stack) > 1:
                    self.stack.pop()
        
        current_state = self.stack[-1]
        goto_state = self.lr_table.get_goto(current_state, left_side)
        
        if goto_state is None:
            self._record_error(f"No hay transición GOTO desde estado {current_state} con símbolo '{left_side}'")
            return
        
        self.stack.append(goto_state)
        
        self.transitions.append({
            'step': self.step_count,
            'action': f'reduce {rule_number} ({rule})',
            'stack': list(self.stack),
            'input': list(self.input_buffer),
            'rule': rule,
            'rule_number': rule_number,
            'position': self.current_position
        })
    
    def _perform_accept(self):
        self.accepted = True
        self.transitions.append({
            'step': self.step_count,
            'action': 'accept',
            'stack': list(self.stack),
            'input': list(self.input_buffer),
            'message': 'Cadena aceptada',
            'position': self.current_position
        })
    
    def _record_error(self, message):
        self.error_message = message
        self.accepted = False
        self.transitions.append({
            'step': self.step_count,
            'action': 'error',
            'stack': list(self.stack),
            'input': list(self.input_buffer),
            'error': message,
            'position': self.current_position
        })
    
    def is_accepted(self):
        return self.accepted
    
    def get_summary(self):
        return {
            'accepted': self.accepted,
            'steps': self.step_count,
            'error': self.error_message,
            'final_stack': self.stack,
            'remaining_input': self.input_buffer,
            'current_position': self.current_position
        }
    
    def to_dict(self):
        return {
            'input_string': self.input_string,
            'tokens': self.tokens,
            'accepted': self.accepted,
            'error_message': self.error_message,
            'step_count': self.step_count,
            'transitions': self.transitions,
            'summary': self.get_summary()
        }