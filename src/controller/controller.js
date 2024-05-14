import Todo from '../db/todoSchema'
import csv from 'csv-parser'
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
          const { description, status } = req.body
          if (!description || !status) {
               return res.status(400).json({ error: 'Both description and status are required' })
          }
          const newTodo = new Todo({ description, status })
          await newTodo.save()
          return res.status(201).json({ message: 'Todo created successfully', todo: newTodo })
     } catch (error) {
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
               .pipe(csv())
               .on('data', (row) => {
                    // Assuming CSV has 'description' and 'status' columns
                    const todoItem = new Todo({
                         description: row.description,
                         status: row.status,
                    })
                    todoItems.push(todoItem)
               })
               .on('end', async () => {
                    // Save todo items to the database
                    await Todo.insertMany(todoItems)
                    res.send('CSV file uploaded successfully')
               })
     } catch (error) {}
}
const downloadTodo = async (req, res) => {
     const todos = await Todo.find()
     const csvData = todos.map((todo) => `${todo.description},${todo.status}`).join('\n')

     res.set('Content-Type', 'text/csv')
     res.attachment('todos.csv')
     res.send(csvData)
}

export { getAllTodo, getTodo, addTodo, updateTodo, deleteTodo, uploadTodo, downloadTodo }
