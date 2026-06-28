import React from 'react'

import './style.css'
const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <div className="footer1">
      <div>Copyright © {year} All rights reserved</div>
    </div>
  )
}

export default Footer