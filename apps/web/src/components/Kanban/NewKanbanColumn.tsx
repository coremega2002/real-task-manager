import React from 'react';
import { Box, Typography } from '@mui/material';

const NewKanbanColumn = ({ title }) => {
  return (
    <Box
      sx={{
        width: 300,
        border: '1px solid lightgray',
        borderRadius: 2,
        padding: 1,
        backgroundColor: 'white',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {/* Add TaskCard components here */}
    </Box>
  );
};

export default NewKanbanColumn;
