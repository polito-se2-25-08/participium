import express from 'express';
const app = express();

const host = 'localhost';
const port = 3000;

app.get('/health', (req, res) => {
  res.send('OK');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://${host}:${port}`);
});


export default app;