import React from 'react';

const StatusIcon = ({ status }) => {
  if (status === 'Available') {
    return <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>✔️</span>;
  }
  if (status === 'Booked') {
    return <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>🕒</span>;
  }
  if (status === 'Checked-in') {
    return <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>👤</span>;
  }
  return null;
};

export default StatusIcon;
