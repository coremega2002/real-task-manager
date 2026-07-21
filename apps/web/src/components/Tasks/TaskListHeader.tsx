import React from 'react';
import { Box, Button } from '@mui/material';
import PropTypes from 'prop-types';

function TaskListHeader({ onAddClick, onFilterClick, onSortClick }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
      <Button variant="contained" color="secondary" onClick={onAddClick}>
        Add Task
      </Button>
      <Box>
        <Button onClick={onFilterClick}>Filter</Button>
        <Button onClick={onSortClick}>Sort</Button>
      </Box>
    </Box>
  );
}

TaskListHeader.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  onFilterClick: PropTypes.func.isRequired,
  onSortClick: PropTypes.func.isRequired,
};

export default TaskListHeader;
