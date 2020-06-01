const path = require('path');
const express = require('express');
const app = express();
const port = 5858;

const viewsPath = path.join(__dirname, 'views');
const resourcesPath = path.join(__dirname, 'resources');

app.use(express.static(viewsPath));
app.use(express.static(resourcesPath));

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

app.get('/', (req, res) => res.redirect('login.html'));