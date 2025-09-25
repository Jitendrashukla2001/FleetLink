import React from 'react'
import Navbar from './Navbar'
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
     <div>
      <Navbar />
      <div className="mt-16"> {/* margin for navbar height */}
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout