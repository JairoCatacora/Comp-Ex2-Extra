from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .comp import LR1Parser

router = APIRouter()

class GrammarRequest(BaseModel):
    grammar_text: str
    input_string: str

@router.get("/health")
def health():
    return {"status": "ok"}

@router.post("/api/lr1/parse-string")
async def parse_string_lr1(request: GrammarRequest):
    try:
        parser = LR1Parser(request.grammar_text, request.input_string)
        
        if not parser.build():
            raise HTTPException(
                status_code=400, 
                detail=f"Error al construir el parser: {parser.build_errors}"
            )
        
        visualizations = parser.generate_visualizations()
        summary = parser.get_summary()
        parse_result = parser.parse()
        
        result = {
            "success": True,
            "parsing_result": {
                "message": f"Parser construido {'exitosamente' if summary['table']['is_lr1'] else 'con conflictos'}",
                "accepted": summary['table']['is_lr1'],
                "conflicts": summary['table']['conflicts']
            },
            "statistics": {
                "num_states_afn": summary['afn']['states'],
                "num_states_afd": summary['afd']['states'],
                "num_productions": summary['grammar']['rules'],
                "is_lr1": summary['table']['is_lr1'],
                "conflicts": summary['table']['conflicts']
            },
            "visualizations": {
                "images_available": len(visualizations) > 0,
                "afn_image": visualizations.get('afn'),
                "afd_image": visualizations.get('afd'),
                "table_data": parse_result['table'] if parse_result else None
            }
        }
        
        if parse_result and 'transition_table' in parse_result:
            result["string_parsing"] = {
                "input_string": parse_result['transition_table']['input_string'],
                "accepted": parse_result['transition_table']['accepted'],
                "transitions": parse_result['transition_table']['transitions'],
                "final_state": {
                    "stack": parse_result['transition_table']['final_stack'],
                    "position": parse_result['transition_table']['current_position']
                }
            }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")