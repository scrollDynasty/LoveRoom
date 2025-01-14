import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const ImageViewer = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex || 0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
    >
      <DialogContent 
        style={{ 
          position: 'relative', 
          padding: 0, 
          backgroundColor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh'
        }}
      >
        <IconButton
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white'
          }}
        >
          <CloseIcon />
        </IconButton>

        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              style={{
                position: 'absolute',
                left: 8,
                color: 'white'
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>

            <IconButton
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: 8,
                color: 'white'
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          </>
        )}

        <Box
          component="img"
          src={images[currentIndex]}
          alt="Enlarged view"
          sx={{
            maxHeight: '90vh',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

ImageViewer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  startIndex: PropTypes.number,
  onClose: PropTypes.func.isRequired
};

export default ImageViewer;