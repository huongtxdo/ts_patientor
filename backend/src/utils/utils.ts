import {
  NewPatientInput,
  Gender,
  Diagnosis,
  EntryType,
  EntryWithoutId,
  Discharge,
  HealthCheckRating,
  SickLeave,
} from '../types';
import diagnosisData from '../../data/diagnoses';

/// POST('/api/patients') ///

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNum = (num: unknown): num is number => {
  return typeof num === 'number' || num instanceof Number;
};

const isObject = (object: unknown): object is object => {
  return object instanceof Object || typeof object === 'object';
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Missing or incorrect name');
  }
  return name;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Missing or incorrect date');
  }
  return date;
};

const parseSSN = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Missing or incorrect ssn');
  }
  return ssn;
};

const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(gender);
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

/// POST('/api/patients/:id/entries') ///

export const parseDiagnosisCodes = (
  object: unknown
): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }
  const codeArray = object.diagnosisCodes as Array<string>;
  const availableCodes = diagnosisData.map((data) => data.code);
  let check = true;
  const wrongCodes: string[] = [];
  codeArray.forEach((code) => {
    if (!availableCodes.includes(code)) {
      check = false;
      wrongCodes.push(code);
    }
  });

  if (!check) {
    throw new Error(`Invalid diagnosis code: ${wrongCodes.join(',')}`);
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Missing or incorrect description');
  }
  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Missing or incorrect specialist');
  }
  return specialist;
};

const isEntryType = (entryType: string): entryType is EntryType => {
  return Object.values(EntryType)
    .map((v) => v.toString())
    .includes(entryType);
};

const parseEntryType = (entryType: unknown): EntryType => {
  if (!entryType || !isString(entryType) || !isEntryType(entryType)) {
    throw new Error('Missing or incorrect entry type');
  }
  return entryType;
};

const isHealthRating = (
  healthRating: number
): healthRating is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .filter((a) => typeof a === 'number')
    .includes(healthRating);
};

const parseHealthRating = (healthRating: unknown): HealthCheckRating => {
  if (
    healthRating === undefined ||
    !isNum(healthRating) ||
    !isHealthRating(healthRating)
  ) {
    throw new Error('Missing or incorrect health rating');
  }
  return healthRating;
};

const isDischarge = (discharge: object): discharge is Discharge => {
  if (!discharge || !('date' in discharge) || !('criteria' in discharge)) {
    throw new Error('Missing or incorrect discharge');
  }
  return (
    isString(discharge.date) &&
    isDate(discharge.date) &&
    isString(discharge.criteria)
  );
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || !isObject(discharge) || !isDischarge(discharge)) {
    throw new Error('Missing or incorrect discharge');
  }
  return discharge;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Missing or incorrect employer name');
  }
  return employerName;
};

const isSickLeave = (sickLeave: object): sickLeave is SickLeave => {
  if (!sickLeave || !('startDate' in sickLeave) || !('endDate' in sickLeave)) {
    throw new Error('Missing or incorrect sick leave');
  }
  return (
    isString(sickLeave.startDate) &&
    isDate(sickLeave.startDate) &&
    isString(sickLeave.endDate) &&
    isDate(sickLeave.endDate)
  );
};

const parseSickleave = (sickLeave: unknown): SickLeave | undefined => {
  if (!sickLeave || !isObject(sickLeave) || !isSickLeave(sickLeave)) {
    // throw new Error('Missing or incorrect sick leave');
    return undefined;
  }
  return sickLeave;
};

export const toNewEntryInput = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object') {
    throw new Error(`Missing or incorrect data`);
  }
  let temp;

  if (
    'description' in object &&
    'date' in object &&
    'specialist' in object &&
    'type' in object
  ) {
    temp = {
      description: parseDescription(object.description),
      specialist: parseSpecialist(object.specialist),
      date: parseDate(object.date),
      type: parseEntryType(object.type),
    };
    switch (object.type) {
      case EntryType.HealthCheck:
        if ('healthCheckRating' in object) {
          temp = {
            ...temp,
            healthCheckRating: parseHealthRating(object.healthCheckRating),
          };
        }
        break;
      case EntryType.Hospital:
        if ('discharge' in object) {
          temp = {
            ...temp,
            discharge: parseDischarge(object.discharge),
          };
        }
        break;
      case EntryType.OccupationalHealthcare:
        if ('employerName' in object) {
          temp = {
            ...temp,
            employerName: parseEmployerName(object.employerName),
          };
          if ('sickLeave' in object) {
            temp = {
              ...temp,
              sickLeave: parseSickleave(object.sickLeave),
            };
          }
        }
        break;
      default:
        throw new Error(`Unsupported type for entries: ${object.type}`);
    }

    if ('diagnosisCodes' in object) {
      temp = {
        ...temp,
        diagnosisCodes: parseDiagnosisCodes(object),
      };
    }

    return temp as EntryWithoutId;
  }

  throw new Error('Incorrect data: some fields are missing');
};

