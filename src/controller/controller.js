import Todo from '../db/todoSchema.js'
import csv from 'csv-parser'
import fs from 'fs'
const getAllTodo = async (req, res) => {
     try {
          const todos = await Todo.find()
          return res.status(200).json(todos)
     } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' })
     }
}

const getTodo = async (req, res) => {
     try {
          const { id } = req.params
          const todo = await Todo.findById(id)
          if (!todo) {
               return res.status(404).json({ error: 'Todo not found' })
          }
          return res.status(200).json(todo)
     } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' })
     }
}

const addTodo = async (req, res) => {
     try {
          let { description, status } = req.body
          status = status.toLowerCase()
          if (!description || !status) {
               return res.status(400).json({ error: 'Both description and status are required' })
          }
          const newTodo = new Todo({ description, status })
          await newTodo.save()
          return res.status(201).json({ message: 'Todo created successfully', todo: newTodo })
     } catch (error) {
          console.error(error)
          return res.status(500).json({ error: 'Internal Server Error' })
     }
}

const updateTodo = async (req, res) => {
     try {
          const { id } = req.params
          const { description, status } = req.body

          if (!description && !status) {
               return res.status(400).json({ error: 'At least one of description or status is required for update' })
          }

          const updatedFields = {}
          if (description) updatedFields.description = description
          if (status) updatedFields.status = status

          const updatedTodo = await Todo.findByIdAndUpdate(id, updatedFields, { new: true })
          if (!updatedTodo) {
               return res.status(404).json({ error: 'Todo not found' })
          }
          return res.status(200).json(updatedTodo)
     } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' })
     }
}

const deleteTodo = async (req, res) => {
     try {
          const { id } = req.params
          const deletedTodo = await Todo.findByIdAndDelete(id)
          if (!deletedTodo) {
               return res.status(404).json({ error: 'Todo not found' })
          }
          return res.status(200).json({ message: 'Todo deleted successfully' })
     } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' })
     }
}

const uploadTodo = async (req, res) => {
     try {
          const todoItems = []

          fs.createReadStream(req.file.path)
               .pipe(csv({ separator: ':' }))
               .on('data', (row) => {
                    const description = row['Buy groceries']
                    const status = row['pending']
                    
                    const todoItem = new Todo({
                         description: description,
                         status: status,
                    })
                    todoItems.push(todoItem)
               })
               .on('end', async () => {
                    try {
                         await Todo.insertMany(todoItems)
                         console.log('CSV file uploaded successfully')
                         res.json({ message: 'CSV file uploaded successfully' })
                    } catch (error) {
                         console.error('Error saving todo items:', error)
                         res.status(500).json({ error: 'Error saving todo items' })
                    }
               })
     } catch (error) {
          console.error('Error parsing CSV file:', error)
          res.status(500).json({ error: 'Internal Server Error' })
     }
}

const downloadTodo = async (req, res) => {
     try {
          const todos = await Todo.find()
          const csvData = todos.map((todo) => `${todo.description},${todo.status}`).join('\n')
          res.set('Content-Type', 'text/csv')
          res.attachment('todos.csv')
          res.send(csvData)
     } catch (error) {
          console.error('Error downloading todos:', error)
          res.status(500).json({ error: 'Internal Server Error' })
     }
}
const filterTodo = async (req, res) => {
     try {
          const { status } = req.query
          let todos

          if (status) {
               todos = await Todo.find({ status })
          } else {
               todos = await Todo.find()
          }

          res.status(200).json(todos)
     } catch (error) {
          console.error('Error fetching todos:', error)
          res.status(500).json({ error: 'Internal Server Error' })
     }
}

export { getAllTodo, getTodo, addTodo, updateTodo, deleteTodo, uploadTodo, downloadTodo,filterTodo }
