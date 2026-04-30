import React from 'react';
import RoomSlot from './RoomSlot';

const Calendar = ({ roomsData, role }) => {
  const today = new Date('2026-05-01');
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="glass-panel" style={{ overflowX: 'auto', padding: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Room</th>
            <th style={headerStyle}>Type</th>
            {dates.map(date => {
              const [y, m, d] = date.split('-');
              return (
                <th key={date} style={{ ...headerStyle, minWidth: '150px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>{m}/{y}</div>
                  <div style={{ fontSize: '1.2rem', color: '#fff' }}>{d}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {roomsData.map(room => (
            <tr key={room.room_id} style={{ background: 'rgba(255,255,255,0.02)' }}>
              <td style={{ ...cellStyle, borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', width: '90px', height: '60px' }}>
                    <img 
                      src={`/room_${room.room_type.toLowerCase()}.png`} 
                      alt={room.room_type} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>{room.room_number}</div>
                </div>
              </td>
              <td style={{ ...cellStyle, textTransform: 'capitalize' }}>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {room.room_type}
                </span>
              </td>
              {dates.map((date, idx) => {
                const booking = room.bookings.find(b => {
                  const checkIn = b.check_in_date?.split('T')[0];
                  const checkOut = b.check_out_date?.split('T')[0];
                  return date >= checkIn && date < checkOut; 
                });

                let status = 'Available';
                let customerName = '';

                if (booking) {
                  status = booking.status;
                  customerName = booking.customer?.full_name;
                }

                const isLast = idx === dates.length - 1;
                return (
                  <td key={date} style={{ padding: '4px', borderTopRightRadius: isLast ? '12px' : '0', borderBottomRightRadius: isLast ? '12px' : '0' }}>
                    <RoomSlot 
                      status={status} 
                      customerName={customerName} 
                      date={date}
                      room={room}
                      role={role}
                      booking={booking}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const headerStyle = {
  padding: '15px 10px',
  textAlign: 'center',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  color: '#cbd5e1',
  fontWeight: '600'
};

const cellStyle = {
  padding: '15px 10px',
  textAlign: 'center',
};

export default Calendar;
