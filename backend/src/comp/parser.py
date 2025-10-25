from .grammar import Grammar
from .item import LR1Item
from .afn import AFN
from .afd import AFD
from .table import LRTable
from .transition_table import TransitionTable
from .visualizer import Visualizer

class LR1Parser:
    
    def __init__(self, grammar_content, input_string=""):
        self.grammar_content = grammar_content
        self.input_string = input_string
        self.grammar = None
        self.afn = None
        self.afd = None
        self.table = None
        self.transition_table = None
        self.visualizer = Visualizer()
        self.is_built = False
        self.build_errors = []
    
    def build(self):
        try:
            self.grammar = Grammar(self.grammar_content)
            self.afn = AFN(self.grammar)
            self.afd = AFD(self.afn)
            self.table = LRTable(self.afd)
            
            if self.input_string:
                self.transition_table = TransitionTable(self.input_string, self.table)
            
            self.is_built = True
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
    
    def parse(self):
        if not self.is_built:
            if not self.build():
                return None
        
        result = {
            'table': self.table.to_dict(),
            'conflicts': self.table.conflicts if hasattr(self.table, 'conflicts') else [],
            'grammar': {
                'terminals': list(self.grammar.get_simbolos_terminales()),
                'non_terminals': list(self.grammar.get_simbolos_no_terminales()),
                'productions': self.grammar.reglas
            }
        }
        
        if hasattr(self, 'transition_table') and self.transition_table:
            result['transition_table'] = {
                'input_string': self.transition_table.input_string,
                'transitions': self.transition_table.transitions,
                'accepted': self.transition_table.is_accepted(),
                'final_stack': self.transition_table.stack,
                'current_position': self.transition_table.current_position
            }
        
        return result