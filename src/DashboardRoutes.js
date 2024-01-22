import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Attendees from './pages/Attendees'
import Logs from './pages/Logs'
import ChooseBranch from './pages/ChooseBranch'

function DashboardRoutes() {
  const isAuthenticated = !!localStorage.getItem('token');
  const navigate = useNavigate()
  useEffect(() => {
    if(!isAuthenticated){
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])
  return (
    <div className='pino-dashboard'>
        <Sidebar />
        <div className='content'>
        <Routes>
            <Route path='/attendees' element={<ChooseBranch />} />
            <Route path='/attendees/branch/:branchId' element={<Attendees />} />
            <Route path='/attendees/branch/:branchId' element={<Attendees />} />
            <Route path='/logs' element={<Logs />} />
        </Routes>
        </div>
    </div>
  )
}

export default DashboardRoutes