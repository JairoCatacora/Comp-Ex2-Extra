from .grammar import Grammar
from .item import LR1Item
from .afn import AFN
from .afd import AFD, AFDState
from .table import LRTable
from .visualizer import Visualizer
from .parser import LR1Parser

__version__ = "1.0.0"
__author__ = "Parser LR Team"

__all__ = [
    "Grammar",
    "LR1Item", 
    "AFN",
    "AFD",
    "AFDState",
    "LRTable",
    "Visualizer",
    "LR1Parser"
]

def quick_parse(grammar_content):
    parser = LR1Parser(grammar_content)
    parser.build()
    return parser