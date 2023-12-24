import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';

import { Patient, Diagnosis, EntryWithoutId } from '../../types';

import patientService from '../../services/patients';

import PatientEntryPage from '../PatientEntriesListPage';
import AddPatientEntryForm from '../../components/AddPatientEntry/AddPatientEntryForm';

interface PatientInfoPageProps {
  diagnoses: Diagnosis[];
}

const PatientInfoPage = ({ diagnoses }: PatientInfoPageProps): JSX.Element => {
  const [patient, setPatient] = useState<Patient | undefined>();
  const [error, setError] = useState<string>('');
  const id = useParams().id;

  useEffect(() => {
    const fetchPatient = async (id: string) => {
      const patient = await patientService.getOne(id);
      setPatient(patient);
    };
    id ? void fetchPatient(id) : undefined;
  }, [id]);

  let icon = <TransgenderIcon />;
  if (patient?.gender === 'female') icon = <FemaleIcon />;
  else if (patient?.gender === 'male') icon = <MaleIcon />;

  const submitEntry = async (values: EntryWithoutId) => {
    try {
      if (patient) {
        const addedEntry = await patientService.createEntry(patient.id, values);
        const newPatient = {
          ...patient,
          entries: patient.entries.concat(addedEntry),
        };
        setError('');
        setPatient(newPatient);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === 'string') {
          const message = e.response.data.replace(
            'Something went wrong. Error: ',
            ''
          );
          console.error(message);
          setError(message);
        } else {
          setError('Unrecognized axios error');
        }
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };

  if (!patient) return <></>;

  return (
    <div>
      <Typography
        variant="h4"
        style={{
          marginBottom: '0.5em',
          marginTop: '1em',
        }}
      >
        {patient?.name}
        {icon}
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <AddPatientEntryForm
        entries={patient.entries}
        error={error}
        onSubmit={submitEntry}
      />
      <PatientEntryPage entries={patient.entries} diagnoses={diagnoses} />
    </div>
  );
};

export default PatientInfoPage;

