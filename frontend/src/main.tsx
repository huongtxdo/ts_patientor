import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.tsx';
import { PatientorProvider } from './state/PatientorContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <PatientorProvider>
      <App />
    </PatientorProvider>
  </Router>
);

