import {
  Alert,
  Box,
  Button,
  Checkbox,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import {
  Entry,
  EntryWithoutId,
  EntryType,
  HealthCheckRating,
} from '../../types';

const ratingOptions = Object.values(HealthCheckRating)
  .filter((value) => typeof value === 'number')
  .map((v) => ({
    id: Number(v),
    value: v.toString(),
  }));

const healthCheckCategories = [
  HealthCheckRating[HealthCheckRating.Healthy],
  HealthCheckRating[HealthCheckRating.LowRisk],
  HealthCheckRating[HealthCheckRating.HighRisk],
  HealthCheckRating[HealthCheckRating.CriticalRisk],
];

const availableCodes = [
  'M24.2',
  'M51.2',
  'S03.5',
  'J10.1',
  'J06.9',
  'Z57.1',
  'N30.0',
  'H54.7',
  'J03.0',
  'L60.1',
  'Z74.3',
  'L20',
  'F43.2',
  'S62.5',
  'H35.29',
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface TextFieldFormattedProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
}

const TextFieldFormatted = ({
  label,
  value,
  onChange,
  type,
}: TextFieldFormattedProps) => {
  return (
    <TextField
      id="standard-basic"
      variant="standard"
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
      label={label}
      value={value}
      onChange={onChange}
      type={type}
    />
  );
};

interface AddPatientEntryProps {
  error: string;
  entries: Entry[];
  onSubmit: (values: EntryWithoutId) => void;
}

const AddPatientEntryForm = ({ error, onSubmit }: AddPatientEntryProps) => {
  const [type, setType] = useState(EntryType.HealthCheck);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [codes, setCodes] = useState<string[]>([]);

  const [rating, setRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeaveStart, setSickLeaveStart] = useState<string>('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState<string>('');

  const entryTypeOptions = Object.values(EntryType).map((v) => ({
    value: v,
    label: v.toString(),
  }));

  const selectEntryType = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === 'string') {
      const value = event.target.value;
      const type = Object.values(EntryType).find((e) => e.toString() === value);
      if (type) setType(type);
    }
  };

  const selectCodes = (event: SelectChangeEvent<string[]>) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const selectRating = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === 'string') {
      const value = event.target.value;
      const rating = Object.values(HealthCheckRating)
        .filter((value) => typeof value === 'number')
        .find((h) => h.toString() === value);
      if (typeof rating === 'number') {
        setRating(rating as HealthCheckRating);
      }
    }
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const temp = {
        description,
        date,
        specialist,
        diagnosisCodes: codes,
      };
      if (type === EntryType.HealthCheck) {
        onSubmit({
          ...temp,
          type,
          healthCheckRating: rating,
        });
      } else if (type === EntryType.Hospital) {
        onSubmit({
          ...temp,
          type,
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        });
      } else if (type === EntryType.OccupationalHealthcare) {
        onSubmit({
          ...temp,
          type,
          employerName,
          sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd },
        });
      }
    } catch (e: unknown) {
      console.log('Error: ', e);
    } finally {
      setType(EntryType.HealthCheck);
      setDescription('');
      setDate('');
      setSpecialist('');
      setCodes([]);
      setRating(HealthCheckRating.Healthy);
      setDischargeDate('');
      setDischargeCriteria('');
      setEmployerName('');
      setSickLeaveStart('');
      setSickLeaveEnd('');
    }
  };

  return (
    <div style={{ marginBottom: '1em' }}>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ border: 1, marginTop: '1em' }}>
        <Select label={type} fullWidth value={type} onChange={selectEntryType}>
          {entryTypeOptions.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <TextFieldFormatted
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          type="text"
        />
        <TextFieldFormatted
          label="Entry date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          type="date"
        />
        <TextFieldFormatted
          label="Specialist"
          value={specialist}
          onChange={(event) => setSpecialist(event.target.value)}
          type="text"
        />
        {type === EntryType.HealthCheck && (
          <Select
            label={rating}
            fullWidth
            value={rating.toString()}
            onChange={selectRating}
          >
            {ratingOptions.map((option) => (
              <MenuItem key={option.id} value={option.value}>
                {healthCheckCategories[option.id]}
              </MenuItem>
            ))}
          </Select>
        )}
        {type === EntryType.Hospital && (
          <div>
            <TextFieldFormatted
              label="Discharge date"
              value={dischargeDate}
              onChange={(event) => setDischargeDate(event.target.value)}
              type="date"
            />
            <TextFieldFormatted
              label="Discharge criteria"
              value={dischargeCriteria}
              onChange={(event) => setDischargeCriteria(event.target.value)}
              type="text"
            />
            <InputLabel
              id="demo-multiple-checkbox-label"
              sx={{ fontSize: '80%' }}
            >
              Select diagnosis code
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              fullWidth
              variant="standard"
              multiple
              value={codes}
              onChange={selectCodes}
              input={<OutlinedInput label="Select diagnosis codes" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {availableCodes.map((code) => (
                <MenuItem key={code} value={code}>
                  <Checkbox checked={codes.indexOf(code) > -1} />
                  <ListItemText primary={code} />
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
        {type === EntryType.OccupationalHealthcare && (
          <div>
            <TextFieldFormatted
              label="Employer Name"
              value={employerName}
              onChange={(event) => setEmployerName(event.target.value)}
              type="text"
            />
            <TextFieldFormatted
              label="Sickleave starts"
              value={sickLeaveStart}
              onChange={(event) => setSickLeaveStart(event.target.value)}
              type="date"
            />
            <TextFieldFormatted
              label="Sickleave ends"
              value={sickLeaveEnd}
              onChange={(event) => setSickLeaveEnd(event.target.value)}
              type="date"
            />
            <InputLabel
              id="demo-multiple-checkbox-label"
              sx={{ fontSize: '80%' }}
            >
              Select diagnosis code
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              fullWidth
              variant="standard"
              multiple
              value={codes}
              onChange={selectCodes}
              input={<OutlinedInput label="Select diagnosis codes" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {availableCodes.map((code) => (
                <MenuItem key={code} value={code}>
                  <Checkbox checked={codes.indexOf(code) > -1} />
                  <ListItemText primary={code} />
                </MenuItem>
              ))}
            </Select>
          </div>
        )}

        <Button
          style={{
            float: 'right',
            marginBottom: '1em',
          }}
          sx={{ marginTop: '1em' }}
          fullWidth
          variant="contained"
          onClick={addEntry}
        >
          Add entry
        </Button>
      </Box>
    </div>
  );
};

export default AddPatientEntryForm;

