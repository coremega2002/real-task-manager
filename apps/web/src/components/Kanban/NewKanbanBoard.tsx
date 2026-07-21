import React from 'react';
import { Box } from '@mui/material';

const NewKanbanBoard = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        padding: 2,
        overflowX: 'auto',
      }}
    >
      {/* Add Kanban Column components here */}
    </Box>
  );
};

export default NewKanbanBoard;
