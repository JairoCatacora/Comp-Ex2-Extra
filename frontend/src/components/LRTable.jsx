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
  Divider
} from '@mui/material';
import {
  TableChart as TableIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import './Results.css';

const LRTable = ({ result, statistics }) => {
  if (!result || !statistics) {
    return null;
  }

  const isLR1 = statistics.is_lr1;
  const hasConflicts = statistics.conflicts > 0;

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

        {result.visualizations?.table_html && (
          <Box className="table-html-container">
            <Typography variant="h6" gutterBottom>
              Tabla de Análisis
            </Typography>
            <Box
              className="table-html-content"
              dangerouslySetInnerHTML={{ __html: result.visualizations.table_html }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LRTable;