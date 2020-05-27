const express = require('express');
const app = express();
const port = 5858;

app.use(express.static(__dirname + '/views'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

app.get('/', (req, res) => res.redirect('./home.html'));