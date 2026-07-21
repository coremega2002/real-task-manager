import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import TaskCard from './TaskCard';
import { Task } from '../../types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import TopBar from '../Layout/TopBar';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDragEnd: (result: any) => void;
}

export default function TaskList({ tasks, onEdit, onDragEnd }: TaskListProps) {
  const handleAddTask = () => {
    console.log('Add Task Clicked');
  };
  return (
    <>
      <TopBar title="Task List" onAddClick={handleAddTask} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <TableContainer {...provided.droppableProps} ref={provided.innerRef}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TableCell>
                            <TaskCard task={task} onEdit={onEdit} />
                          </TableCell>
                          <TableCell>{task.statusId}</TableCell>
                          <TableCell>{task.priority}</TableCell>
                          <TableCell>{task.dueDate}</TableCell>
                          <TableCell>
                            <Button onClick={() => onEdit(task)}>Edit</Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
