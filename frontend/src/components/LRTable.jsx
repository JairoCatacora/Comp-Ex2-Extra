import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip
} from '@mui/material';
import {
  TableChart as TableIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import './Results.css';

const LRTable = ({ result, statistics }) => {
  if (!result || !statistics) {
    return null;
  }

  const isLR1 = statistics.is_lr1;
  const hasConflicts = statistics.conflicts > 0;
  const tableData = result.visualizations?.table_data;

  const getStatusIcon = () => {
    if (isLR1) return <CheckIcon color="success" />;
    if (hasConflicts) return <ErrorIcon color="error" />;
    return <WarningIcon color="warning" />;
  };

  const getStatusColor = () => {
    if (isLR1) return 'success';
    if (hasConflicts) return 'error';
    return 'warning';
  };

  const getCellClassName = (value, state, symbol, conflicts) => {
    const hasConflict = conflicts && conflicts.some(
      conflict => conflict.state === state && conflict.terminal === symbol
    );
    
    if (hasConflict) {
      return 'table-cell-conflict conflict-cell';
    }
    
    if (!value) return '';
    
    if (value === 'acc') {
      return 'table-cell-accept';
    }
    
    if (value.startsWith('s')) {
      return 'table-cell-shift';
    }
    
    if (value.startsWith('r')) {
      return 'table-cell-reduce';
    }
    
    if (value && !value.startsWith('s') && !value.startsWith('r') && value !== 'acc') {
      return 'table-cell-goto';
    }
    
    return '';
  };

  const renderTableCell = (value, state, symbol, conflicts) => {
    const className = getCellClassName(value, state, symbol, conflicts);
    const hasConflict = conflicts && conflicts.some(
      conflict => conflict.state === state && conflict.terminal === symbol
    );
    
    if (hasConflict) {
      const conflict = conflicts.find(
        c => c.state === state && c.terminal === symbol
      );
      return (
        <Tooltip 
          title={`Conflicto ${conflict.type}: ${conflict.action1} vs ${conflict.action2}`}
          arrow
        >
          <TableCell align="center" className={className}>
            {value || '—'}
          </TableCell>
        </Tooltip>
      );
    }
    
    return (
      <TableCell align="center" className={className}>
        {value || '—'}
      </TableCell>
    );
  };

  return (
    <Card elevation={3} className="lr-table-card">
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} className="lr-table-header-content">
          <TableIcon />
          <Typography variant="h5" component="h3" className="lr-table-title">
            Tabla LR(1)
          </Typography>
          <Chip 
            label={isLR1 ? 'LR(1) Válida' : 'No LR(1)'} 
            size="small"
            icon={getStatusIcon()}
            className={`status-chip ${getStatusColor()}`}
          />
        </Stack>

        <Alert 
          severity={getStatusColor()} 
          icon={getStatusIcon()}
          className="lr-table-alert"
        >
          <Typography variant="subtitle1" component="div">
            {result.parsing_result?.message || 'Estado del análisis no disponible'}
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom className="statistics-header">
          <InfoIcon />
          Estadísticas de la Tabla
        </Typography>

        <List dense className="statistics-list">
          <ListItem className="statistics-item">
            <ListItemIcon className="statistics-icon">
              <TableIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Estados en la tabla"
              secondary={`${statistics.num_states_afd} estados generados`}
            />
          </ListItem>

          <ListItem className="statistics-item">
            <ListItemIcon className="statistics-icon">
              <InfoIcon color="info" />
            </ListItemIcon>
            <ListItemText
              primary="Producciones de la gramática"
              secondary={`${statistics.num_productions} reglas de producción`}
            />
          </ListItem>

          {hasConflicts && (
            <ListItem className="statistics-item">
              <ListItemIcon className="statistics-icon">
                <ErrorIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Conflictos detectados"
                secondary={`${statistics.conflicts} conflictos en la tabla`}
              />
            </ListItem>
          )}

          <ListItem className="statistics-item">
            <ListItemIcon className="statistics-icon">
              {isLR1 ? <CheckIcon color="success" /> : <WarningIcon color="warning" />}
            </ListItemIcon>
            <ListItemText
              primary="Tipo de gramática"
              secondary={isLR1 ? 'LR(1) - Gramática válida' : 'No LR(1) - Requiere modificaciones'}
            />
          </ListItem>
        </List>

        <Divider className="lr-table-divider" />

        <Typography variant="body2" color="text.secondary" className="info-box">
          {isLR1 
            ? 'La gramática es LR(1) y puede ser analizada sin ambigüedades.'
            : 'La gramática presenta conflictos que impiden el análisis LR(1). Considera refactorizar las reglas de producción.'
          }
        </Typography>

        {tableData && (
          <>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tabla de Análisis LR(1)
              </Typography>
              
              <TableContainer 
                component={Paper} 
                sx={{ maxHeight: 600, overflow: 'auto' }}
                className="lr-table-container"
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        align="center" 
                        className="table-header-state"
                      >
                        Estado
                      </TableCell>
                      {tableData.table.headers.action.map((terminal) => (
                        <TableCell 
                          key={`action-${terminal}`} 
                          align="center"
                          className="table-header-action"
                        >
                          {terminal}
                        </TableCell>
                      ))}
                      {tableData.table.headers.goto.map((nonTerminal) => (
                        <TableCell 
                          key={`goto-${nonTerminal}`} 
                          align="center"
                          className="table-header-goto"
                        >
                          {nonTerminal}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.table.rows.map((row) => (
                      <TableRow key={row.state} hover>
                        <TableCell 
                          align="center" 
                          className="table-cell-state"
                        >
                          {row.state}
                        </TableCell>
                        {tableData.table.headers.action.map((terminal) => (
                          <React.Fragment key={`${row.state}-action-${terminal}`}>
                            {renderTableCell(
                              row.action[terminal], 
                              row.state, 
                              terminal, 
                              tableData.conflicts
                            )}
                          </React.Fragment>
                        ))}
                        {tableData.table.headers.goto.map((nonTerminal) => (
                          <TableCell 
                            key={`${row.state}-goto-${nonTerminal}`}
                            align="center"
                            className={getCellClassName(row.goto[nonTerminal])}
                          >
                            {row.goto[nonTerminal] || '—'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Leyenda */}
            <Box sx={{ mt: 2 }} className="legend-container">
              <Typography variant="subtitle2" gutterBottom>
                Leyenda:
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Chip 
                  label="sN - Shift al estado N" 
                  size="small" 
                  className="legend-chip-shift"
                />
                <Chip 
                  label="rN - Reduce por regla N" 
                  size="small" 
                  className="legend-chip-reduce"
                />
                <Chip 
                  label="acc - Aceptar" 
                  size="small" 
                  className="legend-chip-accept"
                />
                <Chip 
                  label="N - Ir al estado N" 
                  size="small" 
                  className="legend-chip-goto"
                />
                {hasConflicts && (
                  <Chip 
                    label="Conflicto" 
                    size="small" 
                    className="legend-chip-conflict"
                  />
                )}
              </Stack>
            </Box>

            {/* Reglas de la gramática */}
            {tableData.grammar_rules && (
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">
                    Reglas de Producción ({tableData.grammar_rules.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {tableData.grammar_rules.map((rule, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={`R${index}: ${rule}`}
                          primaryTypographyProps={{ 
                            fontFamily: 'monospace',
                            fontSize: '0.9rem'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Detalles de conflictos */}
            {hasConflicts && tableData.conflicts && (
              <Accordion sx={{ mt: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" color="error">
                    Detalles de Conflictos ({tableData.conflicts.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {tableData.conflicts.map((conflict, index) => (
                      <ListItem key={index} divider>
                        <ListItemIcon>
                          <ErrorIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Estado ${conflict.state}, Terminal '${conflict.terminal}'`}
                          secondary={`Conflicto ${conflict.type}: ${conflict.action1} vs ${conflict.action2}`}
                          secondaryTypographyProps={{ 
                            fontFamily: 'monospace',
                            color: 'error.main'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}
          </>
        )}

        {!tableData && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No se pudo generar la tabla LR(1). Revisa la gramática de entrada.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default LRTable;