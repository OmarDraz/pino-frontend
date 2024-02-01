// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AttendeeForm from './pages/AttendeeForm';
import DashboardRoutes from './DashboardRoutes';
import ChooseBranch from './pages/ChooseBranch';
import Login from './pages/Login';
import Logout from './Logout';

function App() {

  return (
    <Router>
        {/* ... existing code ... */}
        <Routes>
          {/* Client Submission Form */}
          <Route path="/" exact element={<ChooseBranch />} />
          <Route path="/submit/:branchId" element={<AttendeeForm />} />
          <Route path="/submit/:branchId" element={<AttendeeForm />} />

          {/* Admin Dashboard with Pages */}
          <Route path="/admin/*" element={<DashboardRoutes />} />
          <Route path='/admin/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />

        </Routes>
    </Router>
  );
}

export default App;
