import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import './Results.css';

const ParsingResults = ({ result, statistics }) => {
  if (!result || !statistics) {
    return null;
  }

  const isSuccess = result.success;
  const isLR1 = statistics.is_lr1;

  return (
    <Card elevation={3} className="parsing-results-card">
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} className="parsing-results-header">
          <AssessmentIcon />
          <Typography variant="h5" component="h3" className="summary-header">
            Resumen del Análisis
          </Typography>
          <Chip 
            label={isSuccess ? 'Éxito' : 'Error'} 
            size="small"
            icon={isSuccess ? <CheckIcon /> : <ErrorIcon />}
            className={`status-chip ${isSuccess ? 'success' : 'error'}`}
          />
        </Stack>

        <Alert 
          severity={isSuccess ? 'success' : 'error'} 
          className={isSuccess ? 'success-alert' : 'error-alert'}
        >
          <Typography variant="subtitle1">
            {result.parsing_result?.message || 'Resultado del análisis no disponible'}
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom className="statistics-header">
          <InfoIcon />
          Estadísticas del Proceso
        </Typography>

        <List dense className="statistics-list">
          <ListItem className="statistics-item">
            <ListItemIcon className="statistics-icon">
              <InfoIcon color="info" />
            </ListItemIcon>
            <ListItemText
              primary="Estados AFN generados"
              secondary={`${statistics.num_states_afn} estados en el autómata no-determinístico`}
            />
          </ListItem>

          <ListItem className="statistics-item">
            <ListItemIcon className="statistics-icon">
              <InfoIcon color="info" />
            </ListItemIcon>
            <ListItemText
              primary="Estados AFD generados"
              secondary={`${statistics.num_states_afd} estados en el autómata determinístico`}
            />
          </ListItem>

          <ListItem className="statistics-item">
            <ListItemIcon className="statistics-icon">
              <InfoIcon color="info" />
            </ListItemIcon>
            <ListItemText
              primary="Reglas de producción"
              secondary={`${statistics.num_productions} producciones en la gramática`}
            />
          </ListItem>

          <Divider className="parsing-results-divider" />

          <ListItem className="statistics-item">
            <ListItemIcon className="statistics-icon">
              {isLR1 ? <CheckIcon color="success" /> : <ErrorIcon color="error" />}
            </ListItemIcon>
            <ListItemText
              primary="Gramática LR(1)"
              secondary={isLR1 ? 'La gramática es LR(1) válida' : 'La gramática no es LR(1)'}
            />
          </ListItem>

          {statistics.conflicts > 0 && (
            <ListItem className="statistics-item">
              <ListItemIcon className="statistics-icon">
                <ErrorIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Conflictos detectados"
                secondary={`${statistics.conflicts} conflictos en la tabla de análisis`}
              />
            </ListItem>
          )}
        </List>

        <Box className="info-box">
          <Typography variant="body2" color="text.secondary">
            <strong>Nota:</strong> {
              isLR1 
                ? 'Tu gramática es válida para análisis LR(1). Puedes proceder con confianza.'
                : 'Tu gramática presenta conflictos. Considera revisar las reglas de producción para eliminar ambigüedades.'
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ParsingResults;