import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  AccountTree as TreeIcon,
  ZoomIn as ZoomIcon
} from '@mui/icons-material';
import ImageModal from './ImageModal';
import './AutomatonVisualization.css';

const AFNVisualization = ({ data, statistics }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!data || !statistics) {
    return null;
  }

  const handleImageClick = () => {
    if (data.afn_image) {
      setModalOpen(true);
    }
  };

  return (
    <>
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
              <Box className="image-wrapper" onClick={handleImageClick}>
                <CardMedia
                  component="img"
                  image={data.afn_image}
                  alt="AFN - Autómata Finito No-determinístico"
                  className="automaton-image clickable-image"
                />
                <Box className="image-overlay">
                  <Tooltip title="Click para ampliar">
                    <IconButton className="zoom-button" size="small">
                      <ZoomIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
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

      <ImageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        imageData={data.afn_image}
        title="AFN - Autómata Finito No-determinístico"
        altText="Visualización del AFN generado a partir de la gramática"
      />
    </>
  );
};

export default AFNVisualization;