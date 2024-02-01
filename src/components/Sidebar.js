import React, {useState} from 'react'
import logo from '../assets/imgs/logo.png'
import MdEventSeat from '@meronex/icons/md/MdEventSeat';
import FaCaretRight from '@meronex/icons/fa/FaCaretRight';
import EnLogOut from '@meronex/icons/en/EnLogOut';
import {NavLink, useNavigate} from 'react-router-dom'

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true)
    const navigate = useNavigate();
    const routes = [
    {
        path: '/admin/attendees',
        name: 'الحاضرين',
        icon: <MdEventSeat />
    },
    // {
    //     path: '/admin/logs',
    //     name: 'سجل الحضور',
    //     icon: <MdInsertDriveFile />
    // },
    ]
  return (
    <div className={`pino-sidebar ${!isOpen && 'collapsed'}`}>
        <span className='collapseBtn' onClick={() => setIsOpen(!isOpen)}>
            <FaCaretRight />
        </span>
        <img src={logo} className='logo' alt="logo" />
        <div className='sidebar_links'>
        {
            routes.map((route) => (
            <NavLink to={route.path} key={route.name} className="nav_link">
                <span>{route.icon}</span>
                <span className="link_text">{route.name}</span>
            </NavLink>
            ))
        }
            <span onClick={() => navigate('/logout')} className='nav_link logout'>
                <span><EnLogOut /></span>
                <span className='link_text'>تسجيل خروج</span>
            </span>
        </div>
    </div>
  )
}

export default Sidebar