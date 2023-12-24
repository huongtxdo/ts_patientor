import express from 'express';
import cors from 'cors';

import diagnosesRouter from './routes/dianosesRouter';
import patientsRouter from './routes/patientsRouter';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
