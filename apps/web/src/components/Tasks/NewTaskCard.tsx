import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const NewTaskCard = ({ task }) => {
  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2">{task.description}</Typography>
      </CardContent>
    </Card>
  );
};

export default NewTaskCard;
