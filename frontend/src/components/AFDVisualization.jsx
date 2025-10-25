import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack
} from '@mui/material';
import {
  Hub as HubIcon
} from '@mui/icons-material';
import './AutomatonVisualization.css';

const AFDVisualization = ({ data, statistics }) => {
  if (!data || !statistics) {
    return null;
  }

  return (
    <Card elevation={3} className="automaton-card">
      <CardContent>
        <Box className="automaton-header afd-header">
          <Stack direction="row" alignItems="center" spacing={1}>
            <HubIcon />
            <Typography variant="h5" component="h3" className="automaton-title">
              AFD (Autómata Finito Determinístico)
            </Typography>
            <Chip 
              label={`${statistics.num_states_afd} estados`} 
              size="small" 
              className="automaton-chip"
            />
          </Stack>
        </Box>

        <Box className="automaton-description">
          <Typography variant="body2" color="text.secondary">
            El AFD es el resultado de la determinización del AFN, donde cada estado tiene transiciones únicas.
          </Typography>
        </Box>

        {data.afd_image ? (
          <Box className="automaton-image-container">
            <CardMedia
              component="img"
              image={data.afd_image}
              alt="AFD - Autómata Finito Determinístico"
              className="automaton-image"
            />
          </Box>
        ) : (
          <Box className="no-image-placeholder">
            <Typography variant="body2" color="text.secondary">
              No hay visualización del AFD disponible
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AFDVisualization;