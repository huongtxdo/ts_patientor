import { Route, Link, Routes } from 'react-router-dom';
import { Button, Divider, Container, Typography } from '@mui/material';

import PatientListPage from './components/PatientListPage';
import PatientInfoPage from './components/PatientInfoPage';

const App = () => {
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
          <Route path="/" element={<PatientListPage />} />
          <Route path={`/patients/:id`} element={<PatientInfoPage />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;

