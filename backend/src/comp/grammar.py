class Grammar:
    def __init__(self, gic_content):
        self.gic_content = gic_content
        self.reglas = []
        self.diccionario = {}
        self.start_symbol = None
        self._parse_grammar()
    
    def _parse_grammar(self):
        reglas = self.obtener_reglas(self.gic_content)
        reglas = self.extender_reglas(reglas)
        self.reglas = reglas
        self._build_dictionary()
    
    def obtener_reglas(self, contenido):
        t = contenido.split("\n")
        t = [regla.strip() for regla in t if regla.strip()]
        return t
    
    def extender_reglas(self, reglas):
        if not reglas:
            return reglas
            
        primera_regla = reglas[0]
        term = primera_regla.split(" -> ")[0]
        self.start_symbol = term
        
        new_rule = f"S' -> {term}"
        reglas.insert(0, new_rule)
        return reglas
    
    def _build_dictionary(self):
        for regla in self.reglas:
            partes = regla.split(" -> ")
            if len(partes) == 2:
                lado_izquierdo = partes[0]
                
                if lado_izquierdo not in self.diccionario:
                    self.diccionario[lado_izquierdo] = []
                self.diccionario[lado_izquierdo].append(regla)
    
    def get_producciones(self, simbolo):
        return self.diccionario.get(simbolo, [])
    
    def is_terminal(self, simbolo):
        return simbolo not in self.diccionario
    
    def get_simbolos_no_terminales(self):
        return list(self.diccionario.keys())
    
    def get_simbolos_terminales(self):
        terminales = set()
        for regla in self.reglas:
            partes = regla.split(" -> ")
            if len(partes) == 2:
                lado_derecho = partes[1].split()
                for simbolo in lado_derecho:
                    if self.is_terminal(simbolo) and simbolo not in ['ε', 'epsilon']:
                        terminales.add(simbolo)
        return terminales
    
    def calculate_first(self, symbols):
        if not symbols:
            return {'ε'}
        
        first_set = set()
        
        for i, symbol in enumerate(symbols):
            if self.is_terminal(symbol):
                first_set.add(symbol)
                break
            else:
                symbol_first = self._first_of_nonterminal(symbol)
                first_set.update(symbol_first - {'ε'})
                
                if 'ε' not in symbol_first:
                    break
                elif i == len(symbols) - 1:
                    first_set.add('ε')
        
        return first_set
    
    def _first_of_nonterminal(self, nonterminal):
        if hasattr(self, '_first_cache') and nonterminal in self._first_cache:
            return self._first_cache[nonterminal]
        
        if not hasattr(self, '_first_cache'):
            self._first_cache = {}
        
        if nonterminal in getattr(self, '_computing_first', set()):
            return set()
        
        if not hasattr(self, '_computing_first'):
            self._computing_first = set()
        
        self._computing_first.add(nonterminal)
        
        first_set = set()
        producciones = self.get_producciones(nonterminal)
        
        for produccion in producciones:
            partes = produccion.split(" -> ")
            if len(partes) == 2:
                lado_derecho = partes[1].split()
                
                if not lado_derecho or lado_derecho == [''] or lado_derecho == ['ε'] or lado_derecho == ['epsilon']:
                    first_set.add('ε')
                else:
                    for simbolo in lado_derecho:
                        if self.is_terminal(simbolo):
                            first_set.add(simbolo)
                            break
                        else:
                            symbol_first = self._first_of_nonterminal(simbolo)
                            first_set.update(symbol_first - {'ε'})
                            if 'ε' not in symbol_first:
                                break
                    else:
                        first_set.add('ε')
        
        self._computing_first.remove(nonterminal)
        self._first_cache[nonterminal] = first_set
        return first_set
    
    def calculate_follow(self, nonterminal):
        if hasattr(self, '_follow_cache') and nonterminal in self._follow_cache:
            return self._follow_cache[nonterminal]
        
        if not hasattr(self, '_follow_cache'):
            self._follow_cache = {}
        
        follow_set = set()
        
        if nonterminal == self.start_symbol:
            follow_set.add('$')
        
        for regla in self.reglas:
            partes = regla.split(" -> ")
            if len(partes) == 2:
                lado_izquierdo = partes[0]
                lado_derecho = partes[1].split()
                
                for i, simbolo in enumerate(lado_derecho):
                    if simbolo == nonterminal:
                        beta = lado_derecho[i + 1:]
                        
                        if not beta:
                            if lado_izquierdo != nonterminal:
                                follow_set.update(self.calculate_follow(lado_izquierdo))
                        else:
                            first_beta = self.calculate_first(beta)
                            follow_set.update(first_beta - {'ε'})
                            
                            if 'ε' in first_beta and lado_izquierdo != nonterminal:
                                follow_set.update(self.calculate_follow(lado_izquierdo))
        
        self._follow_cache[nonterminal] = follow_set
        return follow_set