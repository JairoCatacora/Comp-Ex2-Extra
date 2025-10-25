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
        if target_num == -1:
            return
        
        if self.grammar.is_terminal(next_symbol):
            self._add_action(estado_num, next_symbol, 'shift', target_num)
        else:
            self.goto_table[estado_num][next_symbol] = target_num
    
    def _add_action(self, estado, terminal, accion, valor):
        if terminal in self.action_table[estado]:
            existing_action = self.action_table[estado][terminal]
            if existing_action != (accion, valor):
                self._record_conflict(estado, terminal, existing_action, (accion, valor))
                if self._should_prefer_new_action(existing_action, (accion, valor)):
                    self.action_table[estado][terminal] = (accion, valor)
        else:
            self.action_table[estado][terminal] = (accion, valor)
    
    def _should_prefer_new_action(self, existing_action, new_action):
        existing_type, existing_val = existing_action
        new_type, new_val = new_action
        
        if existing_type == 'reduce' and new_type == 'shift':
            return True
        elif existing_type == 'shift' and new_type == 'reduce':
            return False
            
        elif existing_type == 'reduce' and new_type == 'reduce':
            return new_val < existing_val
            
        return False
    
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
    
    def to_dict(self):
        terminales_list = sorted(list(self.terminales))
        no_terminales_list = sorted(list(self.no_terminales))
        
        table_data = {
            "headers": {
                "action": terminales_list,
                "goto": no_terminales_list
            },
            "rows": []
        }
        
        for estado_num in sorted(self.action_table.keys()):
            row = {
                "state": estado_num,
                "action": {},
                "goto": {}
            }
            
            for terminal in terminales_list:
                action = self.get_action(estado_num, terminal)
                if action:
                    action_type, value = action
                    if action_type == 'shift':
                        row["action"][terminal] = f"s{value}"
                    elif action_type == 'reduce':
                        row["action"][terminal] = f"r{value}"
                    elif action_type == 'accept':
                        row["action"][terminal] = "acc"
                else:
                    row["action"][terminal] = ""
            
            for no_terminal in no_terminales_list:
                goto = self.get_goto(estado_num, no_terminal)
                row["goto"][no_terminal] = str(goto) if goto is not None else ""
            
            table_data["rows"].append(row)
        
        conflicts_data = []
        for estado, estado_conflicts in self.conflicts.items():
            for terminal, conflict_info in estado_conflicts.items():
                conflicts_data.append({
                    "state": estado,
                    "terminal": terminal,
                    "type": conflict_info["type"],
                    "action1": self._format_action(conflict_info["action1"]),
                    "action2": self._format_action(conflict_info["action2"])
                })
        
        return {
            "table": table_data,
            "conflicts": conflicts_data,
            "grammar_rules": self.grammar.reglas
        }
    
    def _format_action(self, action):
        action_type, value = action
        if action_type == 'shift':
            return f"shift {value}"
        elif action_type == 'reduce':
            return f"reduce {value}"
        elif action_type == 'accept':
            return "accept"
        return str(action)