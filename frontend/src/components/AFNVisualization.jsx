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
  AccountTree as TreeIcon
} from '@mui/icons-material';
import './AutomatonVisualization.css';

const AFNVisualization = ({ data, statistics }) => {
  if (!data || !statistics) {
    return null;
  }

  return (
    <Card elevation={3} className="automaton-card">
      <CardContent>
        <Box className="automaton-header afn-header">
          <Stack direction="row" alignItems="center" spacing={1}>
            <TreeIcon />
            <Typography variant="h5" component="h3" className="automaton-title">
              AFN (Autómata Finito No-determinístico)
            </Typography>
            <Chip 
              label={`${statistics.num_states_afn} estados`} 
              size="small" 
              className="automaton-chip"
            />
          </Stack>
        </Box>

        <Box className="automaton-description">
          <Typography variant="body2" color="text.secondary">
            El AFN muestra todos los posibles estados y transiciones antes de la determinización.
          </Typography>
        </Box>

        {data.afn_image ? (
          <Box className="automaton-image-container">
            <CardMedia
              component="img"
              image={data.afn_image}
              alt="AFN - Autómata Finito No-determinístico"
              className="automaton-image"
            />
          </Box>
        ) : (
          <Box className="no-image-placeholder">
            <Typography variant="body2" color="text.secondary">
              No hay visualización del AFN disponible
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AFNVisualization;