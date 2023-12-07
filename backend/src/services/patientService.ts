import { v1 as uuid } from 'uuid';

import { PatientWithoutSSN, NewPatientEntry } from '../types';
import patientsData from '../../data/patients';

const getPatients = (): PatientWithoutSSN[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatientEntry): PatientWithoutSSN => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
  };
  patientsData.push(newPatientEntry);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ssn, ...withoutSSN } = newPatientEntry;

  return withoutSSN;
};

export default { getPatients, addPatient };

