require('dotenv').config();
const express = require('express');
const cors = require('cors');

const tasksRouter = require('./routes/tasks');
const currencyRouter = require('./routes/currency');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/tasks', tasksRouter);
app.use('/api/currency', currencyRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
