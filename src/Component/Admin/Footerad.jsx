import React from 'react'
import { Link } from 'react-router-dom'

const Footerad = () => {
  const year = new Date().getFullYear()
  return (
    <div className="footer footeradmin">
      <div>Copyright © {year} All rights reserved</div>
      <Link to='/home'>Shop</Link>
    </div>
  )
}

export default Footerad