require('dotenv').config();
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { routes } from './route';

const app = express();
const PORT = process.env.PORT;

// Logger
app.use(logger('combined'))

// Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes)

app.listen(PORT, ()=>{
    console.log(`Running on Port ${PORT}`);
})


