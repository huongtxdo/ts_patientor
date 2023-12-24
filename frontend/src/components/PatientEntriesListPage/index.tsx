import { Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { Entry, Diagnosis, EntryType } from '../../types';

interface PatientEntryPageProps {
  entries: Entry[];
  diagnoses: Diagnosis[];
}

const PatientEntryPage = ({ entries, diagnoses }: PatientEntryPageProps) => {
  const colors = ['green', 'yellow', 'orange', 'red'];
  return (
    <div>
      <Typography
        variant="h5"
        style={{
          marginBottom: '0.5em',
          marginTop: '1em',
          fontWeight: 'bold',
        }}
      >
        Entries
      </Typography>
      {entries.map((e) => (
        <Box key={e.id} sx={{ border: 1, marginTop: '1em' }}>
          {e.date} <br />
          <i>{e.description}</i> <br />
          {e.type === EntryType.HealthCheck && (
            <>
              <FavoriteIcon
                sx={{ color: colors[Number(e.healthCheckRating)] }}
              />
              <br />
            </>
          )}
          diagnosed by {e.specialist}
          <ul>
            {e.diagnosisCodes?.map((code) => (
              <li key={code}>
                {code} {diagnoses.find((d) => d.code === code)?.name}
              </li>
            ))}
          </ul>
        </Box>
      ))}
    </div>
  );
};

export default PatientEntryPage;

