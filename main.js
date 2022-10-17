require('dotenv').config();
const express = require('express');


const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res, next)=>{
    res.send('hello world!');
})

app.listen(PORT, ()=>{
    console.log(`Running on Port ${PORT}`);
})


