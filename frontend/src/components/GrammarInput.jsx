import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
  Alert
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import './GrammarInput.css';

const GrammarInput = ({ onSubmit, loading }) => {
  const [grammarText, setGrammarText] = useState('');
  const [inputString, setInputString] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!grammarText.trim() || !inputString.trim()) {
      setError('Por favor, ingresa tanto la gramática como la cadena de entrada');
      return;
    }

    setError('');
    onSubmit({ grammarText, inputString });
  };

  const loadExample = () => {
    setGrammarText('S -> E\nE -> E + T\nE -> T\nT -> T * F\nT -> F\nF -> ( E )\nF -> id');
    setInputString('id + id * id');
    setError('');
  };

  return (
    <Paper elevation={3} className="grammar-input-container">
      <Typography variant="h5" component="h2" gutterBottom className="grammar-input-title">
        <CodeIcon />
        Entrada de Gramática
      </Typography>

      <Box component="form" onSubmit={handleSubmit} className="grammar-form">
        <Stack spacing={3}>
          <TextField
            label="Gramática"
            multiline
            rows={8}
            fullWidth
            value={grammarText}
            onChange={(e) => setGrammarText(e.target.value)}
            placeholder="Ingresa la gramática, una producción por línea&#10;Ejemplo:&#10;S -> E&#10;E -> E + T&#10;E -> T"
            variant="outlined"
            helperText="Escribe una producción por línea usando el formato: A -> B C"
          />

          <TextField
            label="Cadena de entrada"
            fullWidth
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            placeholder="Ejemplo: id + id * id"
            variant="outlined"
            helperText="Ingresa la cadena que deseas analizar"
          />

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={<PlayIcon />}
              size="large"
              className="submit-button"
            >
              {loading ? 'Analizando...' : 'Analizar Gramática'}
            </Button>
            
            <Button
              type="button"
              variant="outlined"
              onClick={loadExample}
              disabled={loading}
              className="example-button"
            >
              Cargar Ejemplo
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default GrammarInput;