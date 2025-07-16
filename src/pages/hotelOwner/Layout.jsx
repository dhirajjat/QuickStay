import React from 'react';
import Navbar from '../../components/hotelOwner/Navbar';
import Sidebar from '../../components/hotelOwner/Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
