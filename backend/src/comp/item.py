class LR1Item:
    def __init__(self, regla, dot_pos=0, lookahead='$', parent=None):
        self.regla = regla
        self.dot_pos = dot_pos
        self.lookahead = lookahead
        self.parent = parent
        
        self._parse_regla()
        
        self.transition = None
        self.transition_val = None
        self.transition_e = None
        
        self.id = (self.regla, self.dot_pos, self.lookahead)
    
    def _parse_regla(self):
        partes = self.regla.split(" -> ")
        self.current = partes[0]
        self.next = partes[1].split() if len(partes) > 1 else []
        self.dot_pos_mx = len(self.next)
    
    def __str__(self):
        produccion = []
        for i, simbolo in enumerate(self.next):
            if i == self.dot_pos:
                produccion.append(".")
            produccion.append(simbolo)
        if self.dot_pos == self.dot_pos_mx:
            produccion.append(".")
        return f"[{self.current} -> {' '.join(produccion)}, {self.lookahead}]"
    
    def __repr__(self):
        return self.__str__()
    
    def __eq__(self, other):
        if not isinstance(other, LR1Item):
            return False
        return self.id == other.id
    
    def __hash__(self):
        return hash(self.id)
    
    def is_reducible(self):
        return self.dot_pos >= self.dot_pos_mx
    
    def get_next_symbol(self):
        if self.dot_pos < self.dot_pos_mx:
            return self.next[self.dot_pos]
        return None
    
    def get_beta_alpha(self):
        beta = self.next[self.dot_pos + 1:] if self.dot_pos + 1 < len(self.next) else []
        alpha = self.lookahead
        return beta, alpha
    
    def advance_dot(self):
        if self.dot_pos < self.dot_pos_mx:
            return LR1Item(self.regla, self.dot_pos + 1, self.lookahead, self)
        return None
    
    def next_transition(self, estados):
        if self.dot_pos < self.dot_pos_mx:
            next_item = self.advance_dot()
            if next_item and next_item.id not in estados:
                self.transition_val = self.get_next_symbol()
                self.transition = next_item
                estados[next_item.id] = next_item
                return next_item
            elif next_item:
                self.transition = estados[next_item.id]
                self.transition_val = self.get_next_symbol()
                return None
        return None
    
    def next_transition_e(self, estados, grammar):
        if self.dot_pos < self.dot_pos_mx:
            next_symbol = self.get_next_symbol()
            transition_e = []
            
            if next_symbol and not grammar.is_terminal(next_symbol):
                beta, alpha = self.get_beta_alpha()
                first_beta_alpha = grammar.calculate_first(beta + [alpha])
                
                producciones = grammar.get_producciones(next_symbol)
                for produccion in producciones:
                    for first_symbol in first_beta_alpha:
                        new_item_id = (produccion, 0, first_symbol)
                        if new_item_id not in estados:
                            new_item = LR1Item(produccion, 0, first_symbol, self)
                            estados[new_item_id] = new_item
                            transition_e.append(new_item)
                        else:
                            existing_item = estados[new_item_id]
                            if existing_item not in transition_e:
                                transition_e.append(existing_item)
            
            self.transition_e = transition_e if transition_e else None
            return self.transition_e
        return None