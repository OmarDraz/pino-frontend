// Attendees.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import MdAccountBox from '@meronex/icons/md/MdAccountBox';
import MdCall from '@meronex/icons/md/MdCall';
import MdAvTimer from '@meronex/icons/md/MdAvTimer';
import FaWhatsapp from '@meronex/icons/fa/FaWhatsapp';
import socket from '../socket';
const Attendees = () => {
  const [attendees, setAttendees] = useState([]);
  const { branchId } = useParams();
  const socketDesIdRef = useRef(); // Using a ref for socket ID
  const notificationSound = new Audio('/notification.wav');

  const playNotificationSound = () => {
    notificationSound.play();
  };

  useEffect(() => {
    // Listen for the associateSocketId event and update the ref immediately
    const handleAssociateSocketId = (data) => {
      socketDesIdRef.current = data;
      console.log("des", data);
    };

    socket.on('associateSocketId', handleAssociateSocketId);

    // Cleanup the socket connection and remove the event listener on component unmount
    return () => {
      socket.off('associateSocketId', handleAssociateSocketId);
    };
  }, []);

  useEffect(() => {
    const fetchExistingWaitingAttendees = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/submissions?branch_id=${parseInt(branchId)}`);
        setAttendees(response.data);
      } catch (error) {
        console.error('Error fetching existing waiting submissions:', error);
      }
    };

    fetchExistingWaitingAttendees();

    if (parseInt(branchId) === 1) {
      socket.on('newAttendee1', (data) => {
        console.log(data);
        setAttendees((prevAttendees) => [...prevAttendees, { ...data, startTime: new Date() }]);
        playNotificationSound();

      });

      // Clean up the event listener when the component unmounts
      return () => {
        socket.off('newAttendee1');
      };
    } else if (parseInt(branchId) === 2) {
      socket.on('newAttendee2', (data) => {
        console.log(data);
        setAttendees((prevAttendees) => [...prevAttendees, { ...data, startTime: new Date() }]);
        playNotificationSound();

      });

      // Clean up the event listener when the component unmounts
      return () => {
        socket.off('newAttendee2');
      };
    }
  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAttendees((prevAttendees) =>
        prevAttendees.map((item) => ({
          ...item,
          elapsedTime: calculateElapsedTime(item.startTime),
          status: getStatus(item.startTime),
        }))
      );
    }, 1000); // Update every 1000 milliseconds (1 second)

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  const calculateElapsedTime = (startTimeString) => {
    const currentTime = new Date();
    const startTime = new Date(startTimeString);
    const elapsedMilliseconds = currentTime - startTime;
    const minutes = Math.floor(elapsedMilliseconds / (1000 * 60));
    const seconds = Math.floor((elapsedMilliseconds % (1000 * 60)) / 1000);

    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getStatus = (startTimeString) => {
    const startTime = new Date(startTimeString);
    const elapsedMinutes = (new Date() - startTime) / (1000 * 60);

    // Adjust the threshold as needed
    if (elapsedMinutes < 1) {
      return 'وصل للتو';
    } else if (elapsedMinutes > 1 && elapsedMinutes < 10) {
      return 'وصل منذ قليل';
    } else {
      return 'طال الانتظار';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'وصل للتو':
        return 'status-now';
      case 'وصل منذ قليل':
        return 'status-recent';
      case 'طال الانتظار':
        return 'status-long';
      default:
        return '';
    }
  };

  const displayWhatsapp = (status) => {
    switch (status) {
      case 'وصل منذ قليل':
        return (<FaWhatsapp className="me-4 whatsappIcon" />);
      case 'طال الانتظار':
        return (<FaWhatsapp className="me-4 whatsappIcon" />);
      default:
        return '';
    }
  };

  const displayAcceptRemove = (status, id) => {
    switch (status) {
      case 'وصل منذ قليل':
        return (
          <div className='accept-remove'>
            <span className='accept' onClick={() => acceptAttendee(id)}>قبول</span>
            <span className='remove' onClick={() => removeAttendee(id)}>ازالة</span>
          </div>);
      case 'طال الانتظار':
        return (
          <div className='accept-remove'>
            <span className='accept' onClick={() => acceptAttendee(id)}>قبول</span>
            <span className='remove' onClick={() => removeAttendee(id)}>ازالة</span>
          </div>);
      default:
        return (
          <div className='accept-remove'>
            <span className='accept' onClick={() => acceptAttendee(id)}>قبول</span>
            <span className='remove' onClick={() => removeAttendee(id)}>ازالة</span>
          </div>);
    }
  };

  const acceptAttendee = async (id) => {
    try {  
      // Emit an event to the server to notify the specific client
      const socketId = socketDesIdRef.current;

      socket.emit('acceptSubmission', { socketId: socketId, message: 'طاولتك بإنتظارك!' });
  
      // Remove the accepted submission from the local state
      setAttendees((prevAttendees) => prevAttendees.filter((item) => item.id !== id));

  
      // Remove the submission from the server
      const res = await axiosInstance.delete(`http://localhost:3000/submissions/${id}`);
    } catch (error) {
      console.error('Error accepting attendee:', error);
    }
  };

  const removeAttendee = async (id) => {
    const res = await axiosInstance.delete(`http://localhost:3000/submissions/${(id)}`);
    setAttendees((prevAttendees) => prevAttendees.filter((item) => item.id !== id));
  };

  return (
    <div className='pino-attendees col-lg-7 col-md-10 col-sm-11'>
      <h2>الانتظار</h2>
      <div className='attendees'>
        {attendees.map((item, index) => (
          <div key={index} className='item fade-in'>
            <span className='persons'>
              {item.num_of_persons} <br /> اشخاص
            </span>
            {displayAcceptRemove(item.status, item.id)}
            <div className='d-flex flex-column justify-items-between'>
              <div className='name'>
                <MdAccountBox /> {item.name}
              </div>
              <div className='phone'>
                <MdCall /> {item.phone_number}
              </div>
            </div>

            <div className='d-flex flex-column justify-items-between'>
              <div className='d-flex align-items-center'>
                <div className={`status ${getStatusClass(item.status)}`}>
                  {item.status}
                </div>
                {displayWhatsapp(item.status)}
              </div>
              <div className='time-elapsed'>
                <MdAvTimer /> مدة الانتظار: {item.elapsedTime}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attendees;
