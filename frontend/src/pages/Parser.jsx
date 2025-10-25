import { useState } from 'react';
import { CssBaseline, Box, Container, Typography, Alert, CircularProgress } from '@mui/material';
import { parseStringLR1 } from "../utils/api";
import './Parser.css';

// Importar los componentes
import GrammarInput from "../components/GrammarInput";
import ParsingResults from "../components/ParsingResults";
import AFNVisualization from "../components/AFNVisualization";
import AFDVisualization from "../components/AFDVisualization";
import LRTable from "../components/LRTable";
import TransitionTable from "../components/TransitionTable";

function Parser() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async ({ grammarText, inputString }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await parseStringLR1(grammarText, inputString);
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al procesar la gramática');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Box className="parser-page">
        <Container maxWidth="lg" className="parser-container">
          <Typography variant="h3" component="h1" className="parser-title">
            Analizador Sintáctico LR(1)
          </Typography>

          <GrammarInput onSubmit={handleSubmit} loading={loading} />

          {loading && (
            <Box className="loading-container">
              <CircularProgress size={60} />
              <Typography variant="h6" className="loading-text">
                Procesando gramática...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" className="error-alert">
              <Typography variant="h6">Error:</Typography>
              <Typography>{error}</Typography>
            </Alert>
          )}

          {result && (
            <Box className="results-container">
              <ParsingResults result={result} statistics={result.statistics} />
              <LRTable result={result} statistics={result.statistics} />
              {result.string_parsing && (
                <TransitionTable transitionData={result.string_parsing} />
              )}
              {result.visualizations?.images_available && (
                <Box>
                  <AFNVisualization 
                    data={result.visualizations} 
                    statistics={result.statistics} 
                  />
                  <AFDVisualization 
                    data={result.visualizations} 
                    statistics={result.statistics} 
                  />
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}

export default Parser;