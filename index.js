const express = require('express');
const app = express();
const port = 8080;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });   
});  
app.get('/cabs', (req, res) => {
    res.render('cabs', { title: 'Cabs' });   
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});