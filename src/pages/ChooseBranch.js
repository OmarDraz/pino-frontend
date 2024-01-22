import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/imgs/logo.png'
import { useLocation } from 'react-router-dom';

function ChooseBranch() {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className='pino-client-choose-branch'>
        <img src={logo} alt='logo' className='logo' />
        <h3>اختر الفرع</h3>
        <div className='branches'>
            <NavLink to={pathname === '/admin/attendees' ? '/admin/attendees/branch/1' : '/submit/1'}><span>الفرع الاول</span></NavLink>
            <NavLink to={pathname === '/admin/attendees' ? '/admin/attendees/branch/2' : '/submit/2'}><span>الفرع الثاني</span></NavLink>            
        </div>
        {
          console.log(pathname)
        }
    </div>
  )
}

export default ChooseBranch