import { v1 as uuid } from 'uuid';
import {
  PatientWithoutSSN,
  NewPatientInput,
  Patient,
  Entry,
  EntryWithoutId,
} from '../types';
import { parseDiagnosisCodes } from '../utils/toNewEntryInput';
import patientsData from '../../data/patients';

const getPatients = (): PatientWithoutSSN[] => {
  return patientsData.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
    })
  );
};

const getPatient = (id: string): Patient | undefined => {
  const foundPatient = patientsData.find((p) => p.id === id);
  return foundPatient;
};

const addPatient = (patientEntry: NewPatientInput): PatientWithoutSSN => {
  const newPatientEntry = {
    id: uuid(),
    ...patientEntry,
  };
  patientsData.push(newPatientEntry);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ssn, ...withoutSSN } = newPatientEntry;

  return withoutSSN;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const newEntry: Entry = {
    ...entry,
    diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
    id: uuid(),
  };
  patientsData.forEach((patient) => {
    if (patient.id === patientId) {
      // console.log('111111111', patient.entries);
      patient.entries.push(newEntry);
      // console.log('2222222222', patient.entries);
    }
  });
  return newEntry;
};

export default { getPatients, getPatient, addPatient, addEntry };
