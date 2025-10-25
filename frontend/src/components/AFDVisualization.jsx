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
  Hub as HubIcon,
  ZoomIn as ZoomIcon
} from '@mui/icons-material';
import ImageModal from './ImageModal';
import './AutomatonVisualization.css';

const AFDVisualization = ({ data, statistics }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!data || !statistics) {
    return null;
  }

  const handleImageClick = () => {
    if (data.afd_image) {
      setModalOpen(true);
    }
  };

  return (
    <>
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
              <Box className="image-wrapper" onClick={handleImageClick}>
                <CardMedia
                  component="img"
                  image={data.afd_image}
                  alt="AFD - Autómata Finito Determinístico"
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
                No hay visualización del AFD disponible
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <ImageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        imageData={data.afd_image}
        title="AFD - Autómata Finito Determinístico"
        altText="Visualización del AFD generado a partir del AFN"
      />
    </>
  );
};

export default AFDVisualization;