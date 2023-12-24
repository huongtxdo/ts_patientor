import express from 'express';
const router = express.Router();

import patientService from '../services/patientService';
import { toNewPatientInput, toNewEntryInput } from '../utils/utils';

router.get('/', (_req, res) => {
  res.send(patientService.getPatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  // console.log('patient', patient?.entries[0].diagnosisCodes);
  res.send(patient);
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientInput(req.body);
    const addedEntry = patientService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const patientId = req.params.id;
    const addedEntry = patientService.addEntry(
      patientId,
      toNewEntryInput(req.body)
    );
    res.json(addedEntry);
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;

