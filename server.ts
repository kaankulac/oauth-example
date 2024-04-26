import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './src/routes'
import { pool } from './src/services';
import 'dotenv/config' 


dotenv.config()

var app = express();

app.set('view engine', 'ejs');
app.options('*', function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next()
})
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router)

app.get('/home', async (req, res) => {
    let token = req.cookies.token;
    let users = [];
    if(token){
        let userResponse = await pool.query('SELECT * from "users"');
        users = userResponse.rows;
    }
    res.render('index.ejs', {token, users})
})


pool.connect(function (err, client, done) {
    if (err){
        throw err
    }
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
})
