import express, { urlencoded } from 'express';
import bodyParser from 'body-parser';
const app = express();
import routers from './routers/index.js';
import connectDB from './config/mongo.config.js';

connectDB();
app.use(bodyParser.json());
app.use(urlencoded({extended: true}));
app.use('/api', routers);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});