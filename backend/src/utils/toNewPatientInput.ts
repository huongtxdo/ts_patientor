import { NewPatientInput, Gender } from '../types';
import { isString, isGender, parseName, parseDate } from './assertCommonTypes';

const parseSSN = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Missing or incorrect ssn');
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Missing or incorrect gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Missing or incorrect occupation');
  }
  return occupation;
};

export const toNewPatientInput = (object: unknown): NewPatientInput => {
  if (!object || typeof object !== 'object') {
    throw new Error('Missing or incorrect data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  ) {
    const temp: NewPatientInput = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSSN(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: [],
    };
    return temp;
  }

  throw new Error('Incorrect data: some fields are missing');
};

