import express from 'express'
import {
     addTodo,
     deleteTodo,
     downloadTodo,
     filterTodo,
     getAllTodo,
     getTodo,
     updateTodo,
     uploadTodo,
} from '../controller/controller'

const router = express.Router()

router.get('/todos', getAllTodo)
router.get('/todos/:id', getTodo)
router.post('/todos', addTodo)
router.put('/todos/:id', updateTodo)
router.delete('/todos/:id', deleteTodo)
router.post('/todos/upload', uploadTodo)
router.get('/todos/download', downloadTodo)
router.get('/todos/filter', filterTodo)
