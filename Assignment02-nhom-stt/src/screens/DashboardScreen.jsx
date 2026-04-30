import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../redux/roomSlice';
import Calendar from '../components/Calendar';

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const { data: roomsData, status, error } = useSelector((state) => state.rooms);
  
  const [role, setRole] = useState('Customer');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (status === 'loading' && roomsData.length === 0) 
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}><h2 style={{color: '#ff5a5f'}}>Loading Hotel Data...</h2></div>;
  if (status === 'failed') 
    return <h2 style={{ textAlign: 'center', color: '#ff5a5f', padding: '50px' }}>Error: {error}</h2>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '10px' }}>
          <span style={{ color: '#fff' }}>Hotel</span><span style={{ color: '#ff5a5f' }}>Tonight</span> Dashboard
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Premium booking management & availability calendar</p>
      </div>
      
      {/* ROLE SELECTOR (GLASSMORPHISM) */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', margin: '0 auto 30px auto', padding: '20px', maxWidth: '800px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff5a5f, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
          {role === 'Customer' ? '👤' : role === 'Receptionist' ? '🛎️' : '💼'}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px' }}>Current View</h3>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', fontWeight: '600', outline: 'none', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="Customer">Customer (Book available rooms)</option>
            <option value="Receptionist">Receptionist (Manage check-ins)</option>
            <option value="Manager">Hotel Manager (Full override)</option>
          </select>
        </div>
      </div>

      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '15px', marginBottom: '30px' }}>
        {role === 'Customer' ? '✨ Tap on any glowing green slot to book your stay.' : 
         role === 'Receptionist' ? '⚡ Tap amber slots to Check-In, or blue slots to Check-Out.' : 
         '🛡️ Tap any occupied slot to cancel or remove bookings.'}
      </p>
      
      {/* CALENDAR MODULE */}
      <Calendar roomsData={roomsData} role={role} />
      
      {/* LEGEND */}
      <div className="glass-panel" style={{ marginTop: '40px', display: 'flex', gap: '40px', justifyContent: 'center', padding: '20px', flexWrap: 'wrap', maxWidth: '600px', margin: '40px auto 0' }}>
        <div style={legendStyle}>
          <span style={{ ...colorBox, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)' }}></span> <span>Available</span>
        </div>
        <div style={legendStyle}>
          <span style={{ ...colorBox, background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)' }}></span> <span>Booked</span>
        </div>
        <div style={legendStyle}>
          <span style={{ ...colorBox, background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }}></span> <span>Checked-in</span>
        </div>
      </div>
    </div>
  );
};

const legendStyle = { display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500', color: '#cbd5e1' };
const colorBox = { display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%' };

export default DashboardScreen;
