import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import applicationRoutes from './routes/applications';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/applications', applicationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
