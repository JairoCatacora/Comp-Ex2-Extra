from .grammar import Grammar
from .item import LR1Item
from .afn import AFN
from .afd import AFD
from .table import LRTable
from .visualizer import Visualizer

class LR1Parser:
    
    def __init__(self, grammar_content):
        self.grammar_content = grammar_content
        self.grammar = None
        self.afn = None
        self.afd = None
        self.table = None
        self.visualizer = Visualizer()
        self.is_built = False
        self.build_errors = []
    
    def build(self):
        try:
            self.grammar = Grammar(self.grammar_content)
            self.afn = AFN(self.grammar)
            self.afd = AFD(self.afn)
            self.table = LRTable(self.afd)
            
            if self.table.has_conflicts():
                print(f"   Tabla con {len(self.table.conflicts)} conflictos")
            else:
                print("   Tabla sin conflictos (Gramática LR(1))")
            
            self.is_built = True
            print("Parser construido exitosamente\n")
            return True
            
        except Exception as e:
            error_msg = f"Error en la construcción: {e}"
            print(error_msg)
            self.build_errors.append(error_msg)
            self.is_built = False
            return False
    
    def generate_visualizations(self):
        if not self.is_built:
            print("Parser no construido. No se pueden generar visualizaciones.")
            return {}
        
        visualizations = {}
        
        afn_img = self.visualizer.visualize_afn(self.afn)
        if afn_img:
            visualizations['afn'] = afn_img
        
        afd_img = self.visualizer.visualize_afd(self.afd)
        if afd_img:
            visualizations['afd'] = afd_img
        
        return visualizations
    
    def get_summary(self):
        if not self.is_built:
            return {
                "status": "not_built",
                "errors": self.build_errors
            }
        
        return {
            "status": "built",
            "grammar": {
                "rules": len(self.grammar.reglas),
                "terminals": len(self.grammar.get_simbolos_terminales()),
                "non_terminals": len(self.grammar.get_simbolos_no_terminales()),
                "start_symbol": self.grammar.start_symbol
            },
            "afn": {
                "states": len(self.afn)
            },
            "afd": {
                "states": len(self.afd)
            },
            "table": {
                "states": len(self.table.action_table),
                "conflicts": len(self.table.conflicts),
                "is_lr1": not self.table.has_conflicts()
            }
        }
    
    def __str__(self):
        status = "construido" if self.is_built else "no construido"
        return f"LR1Parser({status})"