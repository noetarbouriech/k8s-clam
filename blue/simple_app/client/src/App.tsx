import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Button,
  IconButton
} from '@mui/material'
import { Delete, Add } from '@mui/icons-material'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks`)
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const addTask = async () => {
    try {
      await axios.post(`${API_URL}/api/tasks`, newTask)
      setNewTask({ title: '', description: '' })
      fetchTasks()
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const toggleTask = async (task: Task) => {
    try {
      await axios.put(`${API_URL}/api/tasks/${task.id}`, {
        ...task,
        completed: !task.completed
      })
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`)
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Task Manager
      </Typography>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          label="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          size="small"
        />
        <TextField
          label="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          size="small"
        />
        <Button 
          variant="contained" 
          onClick={addTask}
          startIcon={<Add />}
        >
          Add
        </Button>
      </div>

      <List>
        {tasks.map((task) => (
          <ListItem 
            key={task.id}
            secondaryAction={
              <IconButton 
                edge="end" 
                onClick={() => deleteTask(task.id)}
              >
                <Delete />
              </IconButton>
            }
          >
            <Checkbox
              checked={task.completed}
              onChange={() => toggleTask(task)}
            />
            <ListItemText
              primary={task.title}
              secondary={task.description}
              style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.7 : 1
              }}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default App