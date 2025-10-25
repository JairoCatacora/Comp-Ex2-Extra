from .item import LR1Item

class AFDState:
    
    def __init__(self, items):
        self.items = items
        self.transitions = {}
        self.id = frozenset(item.id for item in items)
    
    def __eq__(self, other):
        if not isinstance(other, AFDState):
            return False
        return self.id == other.id
    
    def __hash__(self):
        return hash(self.id)
    
    def add_transition(self, symbol, target_state):
        self.transitions[symbol] = target_state
    
    def get_transition(self, symbol):
        return self.transitions.get(symbol)


class AFD:
    
    _state_cache = {}
    
    def __init__(self, afn):
        self.afn = afn
        self.grammar = afn.grammar
        self.estados = {}
        self.estado_inicial = None
        self.transitions_map = {}
        AFD._state_cache.clear()
        self._build_afd()
    
    def _build_afd(self):
        if not self.afn.nodo_inicial:
            return
        
        initial_items = self._closure([self.afn.nodo_inicial])
        self.estado_inicial = self._make_state(initial_items)
        self.estados[0] = self.estado_inicial
        
        self._build_states()
    
    def _closure(self, items):
        resultado = list(items)
        visitados = set(item.id for item in items)
        cola = list(items)
        
        while cola:
            item = cola.pop(0)
            next_symbol = item.get_next_symbol()
            
            if next_symbol and not self.grammar.is_terminal(next_symbol):
                beta, alpha = item.get_beta_alpha()
                first_beta_alpha = self.grammar.calculate_first(beta + [alpha])
                
                producciones = self.grammar.get_producciones(next_symbol)
                for produccion in producciones:
                    for first_symbol in first_beta_alpha:
                        if first_symbol != 'ε':
                            new_item = LR1Item(produccion, 0, first_symbol)
                            if new_item.id not in visitados:
                                visitados.add(new_item.id)
                                resultado.append(new_item)
                                cola.append(new_item)
        
        return resultado
    
    def _goto(self, items, symbol):
        next_items = []
        
        for item in items:
            if (not item.is_reducible() and 
                item.get_next_symbol() == symbol):
                next_item = item.advance_dot()
                if next_item:
                    next_items.append(next_item)
        
        if next_items:
            return self._closure(next_items)
        return []
    
    def _make_state(self, items):
        state_id = frozenset(item.id for item in items)
        
        if state_id in AFD._state_cache:
            return AFD._state_cache[state_id]
        
        state = AFDState(items)
        AFD._state_cache[state_id] = state
        return state
    
    def _build_states(self):
        estados_pendientes = [self.estado_inicial]
        estados_procesados = {self.estado_inicial.id}
        counter = 1
        
        while estados_pendientes:
            estado_actual = estados_pendientes.pop(0)
            
            simbolos = set()
            for item in estado_actual.items:
                if not item.is_reducible():
                    simbolos.add(item.get_next_symbol())
            
            for symbol in simbolos:
                goto_items = self._goto(estado_actual.items, symbol)
                
                if goto_items:
                    nuevo_estado = self._make_state(goto_items)
                    
                    estado_actual.add_transition(symbol, nuevo_estado)
                    
                    if nuevo_estado.id not in estados_procesados:
                        estados_procesados.add(nuevo_estado.id)
                        estados_pendientes.append(nuevo_estado)
                        self.estados[counter] = nuevo_estado
                        counter += 1
    
    def get_state_number(self, state):
        for num, st in self.estados.items():
            if st == state:
                return num
        return -1
    
    def __len__(self):
        return len(self.estados)