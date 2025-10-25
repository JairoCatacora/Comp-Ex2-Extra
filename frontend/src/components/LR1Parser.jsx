import { useState } from "react";
import { parseStringLR1 } from "../utils/api";

function LR1Parser() {
    const [grammarText, setGrammarText] = useState("");
    const [inputString, setInputString] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!grammarText.trim() || !inputString.trim()) {
            setError("Por favor, ingresa tanto la gramática como la cadena de entrada");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await parseStringLR1(grammarText, inputString);
            setResult(response);
        } catch (err) {
            setError(err.response?.data?.detail || "Error al procesar la gramática");
        } finally {
            setLoading(false);
        }
    };

    const loadExample = () => {
        setGrammarText("S -> E\nE -> E + T\nE -> T\nT -> T * F\nT -> F\nF -> ( E )\nF -> id");
        setInputString("id + id * id");
    };

    return (
        <div className="lr1-parser">
            <h2>Analizador LR(1)</h2>
            
            <form onSubmit={handleSubmit} className="parser-form">
                <div className="input-section">
                    <div className="grammar-input">
                        <label htmlFor="grammar">Gramática:</label>
                        <textarea
                            id="grammar"
                            value={grammarText}
                            onChange={(e) => setGrammarText(e.target.value)}
                            placeholder="Ingresa la gramática, una producción por línea&#10;Ejemplo:&#10;S -> E&#10;E -> E + T&#10;E -> T"
                            rows="8"
                            cols="50"
                        />
                    </div>
                    
                    <div className="string-input">
                        <label htmlFor="inputString">Cadena de entrada:</label>
                        <input
                            type="text"
                            id="inputString"
                            value={inputString}
                            onChange={(e) => setInputString(e.target.value)}
                            placeholder="Ejemplo: id + id * id"
                        />
                    </div>
                </div>

                <div className="buttons">
                    <button type="submit" disabled={loading}>
                        {loading ? "Procesando..." : "Analizar"}
                    </button>
                    <button type="button" onClick={loadExample}>
                        Cargar Ejemplo
                    </button>
                </div>
            </form>

            {error && (
                <div className="error">
                    <h3>Error:</h3>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="results">
                    <div className="result-summary">
                        <h3>Resultados del Análisis</h3>
                        <div className="status">
                            <strong>Estado:</strong> {result.success ? "✅ Éxito" : "❌ Error"}
                        </div>
                        <div className="parsing-result">
                            <strong>Resultado:</strong> {result.parsing_result?.message || "No disponible"}
                        </div>
                        <div className="statistics">
                            <strong>Estadísticas:</strong>
                            <ul>
                                <li>Estados AFN: {result.statistics?.num_states_afn}</li>
                                <li>Estados AFD: {result.statistics?.num_states_afd}</li>
                                <li>Producciones: {result.statistics?.num_productions}</li>
                                <li>Es LR(1): {result.statistics?.is_lr1 ? "Sí" : "No"}</li>
                            </ul>
                        </div>
                    </div>

                    {result.visualizations?.images_available && (
                        <div className="visualizations">
                            <h3>Visualizaciones de Autómatas</h3>
                            
                            <div className="automaton-images">
                                <div className="nfa-section">
                                    <h4>AFN (Autómata Finito No-determinístico)</h4>
                                    <div className="image-container">
                                        <img 
                                            src={result.visualizations.afn_image}
                                            alt="AFN - Autómata Finito No-determinístico"
                                            className="automaton-image"
                                        />
                                    </div>
                                </div>

                                <div className="dfa-section">
                                    <h4>AFD (Autómata Finito Determinístico)</h4>
                                    <div className="image-container">
                                        <img 
                                            src={result.visualizations.afd_image}
                                            alt="AFD - Autómata Finito Determinístico"
                                            className="automaton-image"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default LR1Parser;