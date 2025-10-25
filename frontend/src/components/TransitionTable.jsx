import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './TransitionTable.css';

const TransitionTable = ({ transitionData }) => {
  if (!transitionData) {
    return (
      <Alert severity="info" className="transition-alert">
        No hay datos de transiciones para mostrar
      </Alert>
    );
  }

  const { input_string, accepted, transitions, final_state } = transitionData;

  const getActionTypeClass = (action) => {
    if (action.includes('shift')) return 'action-shift';
    if (action.includes('reduce')) return 'action-reduce';
    if (action.includes('accept')) return 'action-accept';
    if (action.includes('error')) return 'action-error';
    return 'action-default';
  };

  const formatStack = (stack) => {
    return Array.isArray(stack) ? stack.join(' ') : String(stack || '');
  };

  const formatInput = (input) => {
    return Array.isArray(input) ? input.join(' ') : String(input || '');
  };

  const renderTransitionHeader = () => (
    <Box className="transition-header">
      <Typography variant="h6" className="transition-title">
        Tabla de Transiciones - Análisis LR(1)
      </Typography>
      <Box className="transition-summary">
        <Chip
          icon={accepted ? <CheckCircleIcon /> : <ErrorIcon />}
          label={accepted ? 'Cadena Aceptada' : 'Cadena Rechazada'}
          className={`result-chip ${accepted ? 'result-accepted' : 'result-rejected'}`}
        />
        <Typography variant="body2" className="input-string-display">
          Cadena de entrada: <strong>"{input_string}"</strong>
        </Typography>
      </Box>
    </Box>
  );

  const renderTransitionTable = () => (
    <TableContainer component={Paper} className="transition-table-container">
      <Table size="small" className="transition-table">
        <TableHead>
          <TableRow className="transition-table-header">
            <TableCell className="step-column">Paso</TableCell>
            <TableCell className="action-column">Acción</TableCell>
            <TableCell className="stack-column">Pila</TableCell>
            <TableCell className="input-column">Entrada</TableCell>
            <TableCell className="details-column">Detalles</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transitions.map((transition, index) => (
            <TableRow 
              key={index} 
              className={`transition-row ${getActionTypeClass(transition.action)}`}
            >
              <TableCell className="step-cell">
                <Chip size="small" label={transition.step} className="step-chip" />
              </TableCell>
              
              <TableCell className="action-cell">
                <Box className="action-content">
                  <Chip 
                    size="small" 
                    label={transition.action}
                    className={`action-chip ${getActionTypeClass(transition.action)}`}
                    icon={<PlayArrowIcon />}
                  />
                </Box>
              </TableCell>
              
              <TableCell className="stack-cell">
                <Typography variant="body2" className="stack-content">
                  [{formatStack(transition.stack)}]
                </Typography>
              </TableCell>
              
              <TableCell className="input-cell">
                <Typography variant="body2" className="input-content">
                  {formatInput(transition.input)}
                </Typography>
              </TableCell>
              
              <TableCell className="details-cell">
                {transition.rule && (
                  <Typography variant="caption" className="rule-detail">
                    Regla: {transition.rule}
                  </Typography>
                )}
                {transition.symbol && (
                  <Typography variant="caption" className="symbol-detail">
                    Símbolo: {transition.symbol}
                  </Typography>
                )}
                {transition.error && (
                  <Typography variant="caption" className="error-detail">
                    Error: {transition.error}
                  </Typography>
                )}
                {transition.message && (
                  <Typography variant="caption" className="message-detail">
                    {transition.message}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderFinalState = () => (
    <Accordion className="final-state-accordion">
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className="final-state-header">
        <Typography variant="subtitle1">Estado Final del Análisis</Typography>
      </AccordionSummary>
      <AccordionDetails className="final-state-content">
        <Box className="final-state-details">
          <Typography variant="body2" className="final-stack">
            <strong>Pila final:</strong> [{formatStack(final_state?.stack)}]
          </Typography>
          <Typography variant="body2" className="final-position">
            <strong>Posición final:</strong> {final_state?.position || 0}
          </Typography>
          <Typography variant="body2" className="total-steps">
            <strong>Total de pasos:</strong> {transitions.length}
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box className="transition-table-wrapper">
      {renderTransitionHeader()}
      {renderTransitionTable()}
      {renderFinalState()}
    </Box>
  );
};

export default TransitionTable;