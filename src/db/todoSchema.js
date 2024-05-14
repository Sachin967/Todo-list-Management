import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
     description: {
          type: String,
          required: true,
     },
     status: {
          type: String,
          enum: ['pending', 'completed'], 
          default: 'pending', 
     },
})

const Todo = mongoose.model('Todo', todoSchema)

export default Todo
