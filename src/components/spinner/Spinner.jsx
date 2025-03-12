import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Spinner = ({ size = 40 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', 
        zIndex: 10
      }}
    >
      <CircularProgress size={size}  color='secondary'/>
    </Box>
  );
};

export default Spinner;
