import { useState, useEffect } from 'react';
import { Route, Link, Routes } from 'react-router-dom';
import { Button, Divider, Container, Typography } from '@mui/material';

import { Patient, Diagnosis } from './types';

import patientService from './services/patients';
import diagnosisService from './services/diagnoses';

import PatientListPage from './components/PatientListPage';
import PatientInfoPage from './components/PatientInfoPage';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
      const diagnoses = await diagnosisService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetch();
  }, []);

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: '0.5em' }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route
            path="/"
            element={
              <PatientListPage patients={patients} setPatients={setPatients} />
            }
          />
          <Route
            path={`/patients/:id`}
            element={<PatientInfoPage diagnoses={diagnoses} />}
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;

