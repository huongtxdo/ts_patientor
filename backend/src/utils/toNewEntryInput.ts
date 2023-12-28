import {
  EntryType,
  EntryWithoutId,
  Discharge,
  HealthCheckRating,
  SickLeave,
  Diagnosis,
} from '../types';
import {
  isString,
  isNum,
  isObject,
  isEntryType,
  isHealthRating,
  isDischarge,
  isSickLeave,
  parseDate,
} from './assertCommonTypes';
import diagnosisData from '../../data/diagnoses';

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

const parseEntryType = (entryType: unknown): EntryType => {
  if (!entryType || !isString(entryType) || !isEntryType(entryType)) {
    throw new Error('Missing or incorrect entry type');
  }
  return entryType;
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

const parseSickleave = (sickLeave: unknown): SickLeave | undefined => {
  if (!sickLeave || !isObject(sickLeave) || !isSickLeave(sickLeave)) {
    // throw new Error('Missing or incorrect sick leave');
    return undefined;
  }
  return sickLeave;
};

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
