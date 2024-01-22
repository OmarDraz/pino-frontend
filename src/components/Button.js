import React from 'react'

const Button = ({text, type, onClick}) => {
  return (
    <button className='pino-button' onClick={onClick && onClick} type={type ? type : ''}>{text}</button>
  )
}

export default Button