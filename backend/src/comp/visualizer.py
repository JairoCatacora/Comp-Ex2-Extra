import graphviz
import base64
import os

class Visualizer:
    
    def __init__(self):
        pass
    
    def visualize_afn(self, afn):
        try:
            dot = graphviz.Digraph(comment="AFN LR(1)", format="png")
            dot.attr(rankdir='LR')
            dot.attr('node', shape='circle', color='black', fontcolor='black')
            dot.attr('edge', color='black', fontcolor='black')
            
            visitados = set()
            cola = [afn.nodo_inicial] if afn.nodo_inicial else []
            id_map = {afn.nodo_inicial.id: 0} if afn.nodo_inicial else {}
            contador = 1
            edge_set = set()
            
            while cola:
                actual = cola.pop(0)
                if actual.id in visitados:
                    continue
                visitados.add(actual.id)
                
                label = str(actual).replace('\n', '\\n')
                node_id = str(id_map[actual.id])
                
                if actual == afn.nodo_inicial:
                    dot.node(node_id, label=label, shape="circle", style="bold")
                else:
                    dot.node(node_id, label=label, shape="circle")
                
                if actual.transition is not None:
                    dest = actual.transition
                    if dest.id not in id_map:
                        id_map[dest.id] = contador
                        contador += 1
                        cola.append(dest)
                    
                    edge = (id_map[actual.id], id_map[dest.id], actual.transition_val)
                    if edge not in edge_set:
                        edge_set.add(edge)
                        dot.edge(str(edge[0]), str(edge[1]), label=edge[2])
                
                if actual.transition_e:
                    eps_uniques = {}
                    for dest in actual.transition_e:
                        eps_uniques.setdefault(dest.id, dest)
                    
                    for dest in eps_uniques.values():
                        if dest.id not in id_map:
                            id_map[dest.id] = contador
                            contador += 1
                            cola.append(dest)
                        
                        edge = (id_map[actual.id], id_map[dest.id], "ε")
                        if edge not in edge_set:
                            edge_set.add(edge)
                            dot.edge(str(edge[0]), str(edge[1]), 
                                    label="ε", style="dashed")
            
            png_data = dot.pipe(format='png')
            base64_str = base64.b64encode(png_data).decode('utf-8')
            return f"data:image/png;base64,{base64_str}"
            
        except Exception as e:
            print(f"Error al generar AFN: {e}")
            return None
    
    def visualize_afd(self, afd):
        try:
            dot = graphviz.Digraph(comment="AFD LR(1)", format="png")
            dot.attr(rankdir='LR')
            dot.attr('node', shape='box', style='rounded', color='black', fontcolor='black')
            dot.attr('edge', color='black', fontcolor='black')
            
            for num, estado in afd.estados.items():
                label = "\\n".join(str(item) for item in estado.items)
                
                if num == 0:
                    dot.node(str(num), label=f"Estado {num}\\n{label}", 
                           style="rounded,bold")
                else:
                    dot.node(str(num), label=f"Estado {num}\\n{label}", 
                           style="rounded")
            
            for num, estado in afd.estados.items():
                for symbol, target in estado.transitions.items():
                    target_num = afd.get_state_number(target)
                    if target_num != -1:
                        dot.edge(str(num), str(target_num), label=symbol)
            
            png_data = dot.pipe(format='png')
            base64_str = base64.b64encode(png_data).decode('utf-8')
            return f"data:image/png;base64,{base64_str}"
            
        except Exception as e:
            print(f"Error al generar AFD: {e}")
            return None