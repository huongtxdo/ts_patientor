import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Diagnosis, Patient } from '../types';
import diagnosisService from '../services/diagnoses';
import patientService from '../services/patients';

interface PatientorContext {
  patients: Patient[];
  diagnoses: Diagnosis[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setDiagnoses: React.Dispatch<React.SetStateAction<Diagnosis[]>>;
}

const PatientorContext = createContext<PatientorContext | null>(null);

export function PatientorProvider(props: PropsWithChildren) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEverything = () => {
    diagnosisService
      .getAll()
      .then((diagnoses) => setDiagnoses(diagnoses))
      .finally(() => setLoading(false));
    patientService
      .getAll()
      .then((patients) => setPatients(patients))
      .finally(() => setLoading(false));
  };

  if (loading) {
    fetchEverything();
    return <>loading... </>;
  }

  if (!diagnoses || !patients) {
    return <>no diagnosis or patients</>;
  }

  return (
    <PatientorContext.Provider
      value={{ patients, diagnoses, setPatients, setDiagnoses }}
    >
      {props.children}
    </PatientorContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePatientorContext = () => {
  const context = useContext(PatientorContext);
  if (!context)
    throw new Error(
      'usePatientorContext must be used within PatientorProvider'
    );
  return {
    patients: context.patients,
    setPatients: context.setPatients,
    diagnoses: context.diagnoses,
    setDiagnoses: context.setDiagnoses,
  };
};

