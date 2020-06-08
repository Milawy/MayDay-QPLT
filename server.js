const path = require('path');
const express = require('express');
const app = express();
const port = 5858;

const viewsPath = path.join(__dirname, 'static');

app.use(express.static(viewsPath));

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

app.get('/', (req, res) => res.redirect('login.html'));