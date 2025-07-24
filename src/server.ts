import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoute from './routes/userRoutes'
import adminRoute from './routes/adminRoutes'
import clientRoutes from './routes/clientRoutes'
dotenv.config();

connectDB()
const app = express();  
app.use(express.json());
app.use('/user',userRoute)
app.use('/admin',adminRoute)
app.use('/client',clientRoutes)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});