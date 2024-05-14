import mongoose from 'mongoose'

export const dBConnection = async () => {
     try {
          await mongoose.connect(process.env.MONGODB_URL)
          console.log('Connected to MongoDB')
     } catch (error) {
          console.log(error)
          process.exit(1)
     }
}