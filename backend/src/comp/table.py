class LRTable:
    
    def __init__(self, afd):
        self.afd = afd
        self.grammar = afd.grammar
        self.action_table = {}
        self.goto_table = {}
        self.terminales = self._get_terminales()
        self.no_terminales = self.grammar.get_simbolos_no_terminales()
        self.conflicts = {}
        self._build_table()
    
    def _get_terminales(self):
        terminales = self.grammar.get_simbolos_terminales()
        terminales.add('$')
        return terminales
    
    def _build_table(self):
        for estado_num in self.afd.estados:
            self.action_table[estado_num] = {}
            self.goto_table[estado_num] = {}
        
        for estado_num, estado in self.afd.estados.items():
            self._fill_state_entries(estado_num, estado)
    
    def _fill_state_entries(self, estado_num, estado):
        for item in estado.items:
            if item.is_reducible():
                self._handle_reduce_action(estado_num, item)
            else:
                self._handle_shift_action(estado_num, estado, item)
    
    def _handle_reduce_action(self, estado_num, item):
        if item.regla.startswith("S' ->"):
            if item.lookahead == '$':
                self._add_action(estado_num, '$', 'accept', 0)
        else:
            regla_num = self._get_regla_number(item.regla)
            self._add_action(estado_num, item.lookahead, 'reduce', regla_num)
    
    def _handle_shift_action(self, estado_num, estado, item):
        next_symbol = item.get_next_symbol()
        if not next_symbol:
            return
        
        target_state = estado.get_transition(next_symbol)
        if not target_state:
            return
        
        target_num = self.afd.get_state_number(target_state)
        
        if self.grammar.is_terminal(next_symbol):
            self._add_action(estado_num, next_symbol, 'shift', target_num)
        else:
            self.goto_table[estado_num][next_symbol] = target_num
    
    def _add_action(self, estado, terminal, accion, valor):
        if terminal in self.action_table[estado]:
            existing_action = self.action_table[estado][terminal]
            self._record_conflict(estado, terminal, existing_action, (accion, valor))
        else:
            self.action_table[estado][terminal] = (accion, valor)
    
    def _record_conflict(self, estado, terminal, action1, action2):
        if estado not in self.conflicts:
            self.conflicts[estado] = {}
        
        conflict_type = self._determine_conflict_type(action1, action2)
        self.conflicts[estado][terminal] = {
            'type': conflict_type,
            'action1': action1,
            'action2': action2
        }
    
    def _determine_conflict_type(self, action1, action2):
        types = {action1[0], action2[0]}
        
        if 'shift' in types and 'reduce' in types:
            return 'shift_reduce'
        elif types == {'reduce'}:
            return 'reduce_reduce'
        else:
            return 'unknown'
    
    def _get_regla_number(self, regla):
        try:
            return self.grammar.reglas.index(regla)
        except ValueError:
            return -1
    
    def get_action(self, estado, terminal):
        return self.action_table.get(estado, {}).get(terminal)
    
    def get_goto(self, estado, no_terminal):
        return self.goto_table.get(estado, {}).get(no_terminal)
    
    def has_conflicts(self):
        return len(self.conflicts) > 0
    
    def __str__(self):
        conflicts_str = f", conflictos={len(self.conflicts)}" if self.conflicts else ""
        return f"LRTable(estados={len(self.action_table)}{conflicts_str})"