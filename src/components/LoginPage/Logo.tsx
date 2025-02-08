import React from 'react'
import logo from '../../assets/logo.png'
const Logo: React.FC = () => {
  return (
    <div className="logo-container">
      <img src={logo} alt="Logo" className="logo" />
      <p className="version-text">Mobile V4 2.1.0.24111101</p>
    </div>
  )
}

export default Logo
