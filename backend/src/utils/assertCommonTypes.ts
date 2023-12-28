import {
  Gender,
  EntryType,
  Discharge,
  HealthCheckRating,
  SickLeave,
} from '../types';

export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isNum = (num: unknown): num is number => {
  return typeof num === 'number' || num instanceof Number;
};

export const isObject = (object: unknown): object is object => {
  return object instanceof Object || typeof object === 'object';
};

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(gender);
};

export const isEntryType = (entryType: string): entryType is EntryType => {
  return Object.values(EntryType)
    .map((v) => v.toString())
    .includes(entryType);
};

export const isHealthRating = (
  healthRating: number
): healthRating is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .filter((a) => typeof a === 'number')
    .includes(healthRating);
};

export const isDischarge = (discharge: object): discharge is Discharge => {
  if (!discharge || !('date' in discharge) || !('criteria' in discharge)) {
    throw new Error('Missing or incorrect discharge');
  }
  return (
    isString(discharge.date) &&
    isDate(discharge.date) &&
    isString(discharge.criteria)
  );
};

export const isSickLeave = (sickLeave: object): sickLeave is SickLeave => {
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

export const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Missing or incorrect name');
  }
  return name;
};

export const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Missing or incorrect date');
  }
  return date;
};

