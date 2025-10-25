import React, { useState } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Fab,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  ZoomOutMap as FitIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material';
import './ImageModal.css';

const ImageModal = ({ open, onClose, imageData, title, altText }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleFitToScreen = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    if (!imageData) return;
    
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `${title || 'automaton'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(prev * delta, 5)));
  };

  const handleClose = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        handleClose();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case '0':
        handleFitToScreen();
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  if (!open || !imageData) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="image-modal"
      closeAfterTransition
    >
      <Box className="image-modal-container">
        {/* Header */}
        <Paper elevation={2} className="image-modal-header">
          <Typography variant="h6" className="image-modal-title">
            {title || 'Visualización del Autómata'}
          </Typography>
          
          <Box className="image-modal-controls">
            <Tooltip title="Zoom In (+)">
              <IconButton onClick={handleZoomIn} size="small" className="control-button">
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            
            <Typography variant="body2" className="zoom-indicator">
              {Math.round(zoom * 100)}%
            </Typography>
            
            <Tooltip title="Zoom Out (-)">
              <IconButton onClick={handleZoomOut} size="small" className="control-button">
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Ajustar a pantalla (0)">
              <IconButton onClick={handleFitToScreen} size="small" className="control-button">
                <FitIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Descargar imagen">
              <IconButton onClick={handleDownload} size="small" className="control-button">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Cerrar (Esc)">
              <IconButton onClick={handleClose} size="small" className="control-button close-button">
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Image Container */}
        <Box 
          className="image-modal-content"
          onWheel={handleWheel}
        >
          <div
            className={`image-container ${isDragging ? 'dragging' : ''} ${zoom > 1 ? 'zoomable' : ''}`}
            onMouseDown={handleMouseDown}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
          >
            <img
              src={imageData}
              alt={altText || 'Visualización del autómata'}
              className="modal-image"
              draggable={false}
              onLoad={() => {
                // Opcional: Ajustar zoom inicial si la imagen es muy grande
                const img = document.querySelector('.modal-image');
                if (img) {
                  const containerWidth = document.querySelector('.image-modal-content').clientWidth;
                  const containerHeight = document.querySelector('.image-modal-content').clientHeight;
                  const imgWidth = img.naturalWidth;
                  const imgHeight = img.naturalHeight;
                  
                  const scaleX = containerWidth / imgWidth;
                  const scaleY = containerHeight / imgHeight;
                  const initialZoom = Math.min(scaleX, scaleY, 1);
                  
                  if (initialZoom < 1) {
                    setZoom(initialZoom);
                  }
                }
              }}
            />
          </div>
        </Box>

        {/* Instructions */}
        <Paper elevation={1} className="image-modal-instructions">
          <Typography variant="caption" className="instructions-text">
            <strong>Controles:</strong> Rueda del ratón para zoom • Arrastrar para mover • 
            Teclas: +/- (zoom) • 0 (ajustar) • Esc (cerrar)
          </Typography>
        </Paper>
      </Box>
    </Modal>
  );
};

export default ImageModal;