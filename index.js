const cookieParser = require('cookie-parser');
const express = require('express');
const requestIp = require('request-ip')
const dbManager = require('./db');
const app = express();
const port = 8080;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', './views');

const authMiddleware = async (req, res, next) => {
    const userExists = await dbManager.getUserByIP(requestIp.getClientIp(req)); // Assume checkUserExists is a function that checks if the user exists
    if (!userExists) {
        if (req.path === '/login') {
            return next();
        }
        return res.redirect('/login');
    }
    return next();
}

app.use(cookieParser());
app.use(authMiddleware);

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const ipAddress = requestIp.getClientIp(req);
    const userExists = await dbManager.getUserByIP(ipAddress);
    if (!username) {
        res.status(400).send('Username is required');
    }
    if (!userExists) {
        await dbManager.createUser(username, ipAddress);
    }
    res.redirect('/');
});

app.get('/cabs', (req, res) => {
    res.render('cabs', { title: 'Cabs' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});