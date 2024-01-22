
import React from 'react'
import MdCancel from '@meronex/icons/md/MdCancel'

const Modal = ({title, children, toggle, setToggle, openedPermanently}) => {
  return (
    <div className='pino-modal-container d-flex align-items-center justify-content-center' onClick={() => !openedPermanently && setToggle(false)} style={{ visibility: toggle ? 'visible' : 'hidden', opacity: toggle ? '1' : '0', transition: '.2s ease-in-out' }}>
        <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between">
              {
                !openedPermanently &&                 
                <>
                <h3 className='headings'>{title}</h3>
                <MdCancel style={{ cursor: 'pointer' }} onClick={() => !openedPermanently && setToggle(false)} />
                </>
              }
            </div>
            {children}
        </div>
    </div>
  )
}

export default Modal