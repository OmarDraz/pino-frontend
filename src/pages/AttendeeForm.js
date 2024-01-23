import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import Modal from '../components/Modal';
import logo from '../assets/imgs/logo.png';
import MdAvTimer from '@meronex/icons/md/MdAvTimer';
import MdEventSeat from '@meronex/icons/md/MdEventSeat';
import FaFacebookF from '@meronex/icons/fa/FaFacebookF';
import MdcFoodForkDrink from '@meronex/icons/mdc/MdcFoodForkDrink';
import { useLocation, useParams } from 'react-router-dom';
import socket from '../socket';

const AttendeeForm = () => {
  const location = useLocation();
  const { pathname } = location;
  const { branchId } = useParams();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    num_of_persons: 1,
    seatPreference: '',
  });
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState({
    averageWaitingTime: '',
    order: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    socket.on('welcomeMessage', (message) => {
      setWelcomeMessage(message);
    });

    return () => {
      socket.off('welcomeMessage');
    };
  }, []);


  useEffect(() => {
    if (modalData) {

      // Start the countdown when modalData is available
      const countdownInterval = setInterval(async () => {
        setModalData((prevData) => ({
          ...prevData,
          averageWaitingTime: prevData.averageWaitingTime - 1000,
        }));
      }, 1000);


      // Clear the interval when the countdown reaches 0
      if (modalData.averageWaitingTime <= 1000) {
        clearInterval(countdownInterval);
      }
 
      // Cleanup the interval on component unmount
      return () => clearInterval(countdownInterval);
    }
  }, [modalData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Verify the number of persons
        if (formData.num_of_persons < 1) {
          alert('عدد الأشخاص يجب أن يكون على الأقل 1');
          return;
        }

        // Verify the phone number
        const phoneNumberRegex = /^[0-9]+$/;
        if (!phoneNumberRegex.test(formData.phone_number)) {
          alert('رقم الهاتف يجب أن يحتوي على أرقام فقط');
          return;
        }
      setModal(true);

      // Disable form fields and submit button after submission
      setFormSubmitted(true);

      const res = await axios.post('http://localhost:3000/api/attendees', {
        ...formData,
        branchId: branchId,
      });

      setModalData(res.data);
      socket.emit('associateSocketId', socket.id);
    } catch (error) {
      console.error('Error submitting attendee:', error);
    }
  };

  const minutes = Math.floor(modalData.averageWaitingTime / (1000 * 60));
  const seconds = Math.floor((modalData.averageWaitingTime % (1000 * 60)) / 1000);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div className='pino-attendee-form'>
      <form className='col-lg-6 col-md-10 col-sm-11' onSubmit={handleSubmit}>
        <img src={logo} alt="logo" className='logo' />
        <div className='pino-inputGroup'>
          <label className='fw-bold' htmlFor="name">الاسم:</label>
          <input
            type="text"
            id="name"
            className="input"
            name="name"
            value={formData.name}
            required
            onChange={handleChange}
            disabled={formSubmitted}
          />
        </div>

        <div className='pino-inputGroup'>
          <label className='fw-bold' htmlFor="phone_number">رقم الهاتف:</label>
          <input
            type="tel"
            id="phone_number"
            className="input"
            name="phone_number"
            value={formData.phone_number}
            required
            pattern="[0-9]+"
            inputMode="numeric"
            onChange={handleChange}
            disabled={formSubmitted}
          />
        </div>

        <div className='pino-inputGroup'>
          <label className='fw-bold' htmlFor="num_of_persons">عدد الاشخاص:</label>
          <input
            type="number"
            id="num_of_persons"
            className="input"
            name="num_of_persons"
            value={formData.num_of_persons}
            required
            min="1"
            onChange={handleChange}
            disabled={formSubmitted}
          />
        </div>

        {pathname === '/submit/2' && 
          <div className='pino-inputGroup'>
            <label className='fw-bold' htmlFor="seatPreference">مكان الجلوس:</label>
            <select
              id="seatPreference"
              className="input"
              name="seatPreference"
              value={formData.seatPreference}
              onChange={handleChange}
              disabled={formSubmitted}
            >
              <option value="" disabled>داخلي أم خارجي</option>
              <option value="Indoor">داخلي</option>
              <option value="Outdoor">خارجي</option>
            </select>
          </div>
        }

        <Button type="submit" text="سجل حضورك" disabled={formSubmitted} />
      </form>

      <Modal toggle={modal} title="برجاء عدم غلق نافذة المتصفح" openedPermanently={true} setToggle={setModal}>
        <div className='waiting-screen d-flex align-items-center justify-content-center flex-column'>
          {
            welcomeMessage === '' ?           
            <>
            <img src={logo} alt='logo' />
            <div className='time-elapsed'>
              <MdAvTimer /> مدة الانتظار: {`${formattedMinutes}:${formattedSeconds}`}
            </div>
            <div className='people'>
              <MdEventSeat /> أمامك {modalData.order - 1} اشخاص
            </div>
            <div className='social-icons'>
              <a href="#0"><MdcFoodForkDrink /></a>
              <a href="#0"><FaFacebookF /></a>
            </div>
            </> : <h3 className='welcomeMessage'>{welcomeMessage}</h3>
          }
        </div>
      </Modal>
    </div>
  );
};

export default AttendeeForm;
