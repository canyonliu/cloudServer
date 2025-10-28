const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World! you and me, first meeting， 自动化部署代码实验');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});