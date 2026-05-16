import dotenv from 'dotenv';
dotenv.config();
import express from 'express'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req,res)=>{
    res.send({message: "Hello People!"})
});

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});