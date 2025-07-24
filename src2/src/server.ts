import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import theaterRoute from './routes/theaterRoutes/theaterRoutes';
dotenv.config();

connectDB()
const app = express();  
app.use(express.json());

app.use('/theater', theaterRoute)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});