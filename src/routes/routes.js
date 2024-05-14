import express from 'express'
import {
     addTodo,
     deleteTodo,
     downloadTodo,
     filterTodo,
     // filterTodo,
     getAllTodo,    
     getTodo,
     updateTodo,
     uploadTodo,
} from '../controller/controller.js'
import upload from '../multer.js'

const router = express.Router()

router.get('/todos', getAllTodo)
router.get('/todos/:id', getTodo)
router.post('/todos', addTodo)
router.put('/todos/:id',  updateTodo)
router.delete('/todos/:id', deleteTodo)
router.post('/todos/upload', upload.single('csvFile'), uploadTodo)
router.get('/todo/download', downloadTodo)
router.get('/todo/filter', filterTodo)

export default router