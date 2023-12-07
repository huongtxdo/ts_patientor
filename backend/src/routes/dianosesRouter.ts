import express from 'express';
const router = express.Router();

import dianosisService from '../services/dianosisService';

router.get('/', (_req, res) => {
  res.send(dianosisService.getDiagnoses());
});

router.post('/', (_req, _res) => {
  //...
});

export default router;

