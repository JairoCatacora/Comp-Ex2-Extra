from .item import LR1Item

class AFN:
    def __init__(self, grammar):
        self.grammar = grammar
        self.estados = {}
        self.nodo_inicial = None
        self._build_afn()
    
    def _build_afn(self):
        if not self.grammar.reglas:
            return
        
        regla_inicial = self.grammar.reglas[0]
        self.nodo_inicial = LR1Item(regla_inicial, 0, '$')
        self.estados[self.nodo_inicial.id] = self.nodo_inicial
        
        self._build_states(self.nodo_inicial)
    
    def _build_states(self, nodo_inicial):
        visitados = set()
        
        def dfs(nodo):
            if nodo is None or nodo.id in visitados:
                return
            
            visitados.add(nodo.id)
            
            siguiente = nodo.next_transition(self.estados)
            if siguiente is not None:
                dfs(siguiente)
            
            epsilon_transitions = nodo.next_transition_e(self.estados, self.grammar)
            if epsilon_transitions:
                for item in epsilon_transitions:
                    dfs(item)
        
        dfs(nodo_inicial)
    
    def __len__(self):
        return len(self.estados)