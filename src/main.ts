require('dotenv').config();
import express, { ErrorRequestHandler } from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';


import { routes } from './route/index.route';
import { errorHandler } from './util/helper.util';

const app = express();
const PORT = process.env.PORT;
const secret = process.env.SECRET || 'abv6as-d5gbsa-46dsd9';


// CORS
app.use(cors())

// Logger
app.use(logger('combined'))

// Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Session
app.use(session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

// Routes
app.use(routes)




// ERROR HANDLER
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Running on Port ${PORT}`);
})


