import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDashboardData } from '../redux/roomSlice';
import axios from 'axios';

// --- CUSTOM MODAL COMPONENT ---
const PremiumModal = ({ isOpen, type, title, message, onClose, onConfirm }) => {
  if (!isOpen) return null;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(10px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
      animation: 'modalFadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #1e293b, #0f172a)',
        padding: '35px', borderRadius: '24px', width: '90%', maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <h2 style={{ marginBottom: '10px', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{title}</h2>
        {message && <p style={{ color: '#94a3b8', marginBottom: '25px', lineHeight: '1.5' }}>{message}</p>}
        
        {type === 'BOOKING' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '500' }}>Tên Khách Hàng</label>
              <input 
                type="text" value={name} onChange={e => setName(e.target.value)} 
                placeholder="Nhập họ và tên..." autoFocus
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '500' }}>Số Điện Thoại</label>
              <input 
                type="text" value={phone} onChange={e => setPhone(e.target.value)} 
                placeholder="Nhập số điện thoại..."
                style={inputStyle} 
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} style={cancelBtnStyle}>Hủy</button>
          <button 
            onClick={() => {
              if (type === 'BOOKING') {
                if (!name || !phone) return alert('Vui lòng nhập đủ thông tin!');
                onConfirm({ name, phone });
              } else {
                onConfirm();
              }
            }} 
            style={confirmBtnStyle}
          >
            {type === 'BOOKING' ? '✨ Xác nhận Đặt phòng' : 'Đồng ý'}
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '14px 16px', borderRadius: '12px',
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.2s'
};

const confirmBtnStyle = {
  background: 'linear-gradient(135deg, #ff5a5f, #e11d48)', color: '#fff', 
  padding: '12px 24px', borderRadius: '12px', border: 'none', 
  fontWeight: '600', fontSize: '1rem', cursor: 'pointer', transition: 'transform 0.1s',
  boxShadow: '0 4px 15px rgba(255, 90, 95, 0.4)'
};

const cancelBtnStyle = {
  background: 'transparent', color: '#cbd5e1', padding: '12px 20px', borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.1)', fontWeight: '600', fontSize: '1rem', cursor: 'pointer',
  transition: 'background 0.2s'
};

// --- ROOM SLOT COMPONENT ---
const RoomSlot = ({ status, customerName, date, room, role, booking }) => {
  const dispatch = useDispatch();
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  const handleCloseModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  const handleSlotClick = () => {
    if (role === 'Customer') {
      if (status === 'Available') {
        setModalConfig({
          isOpen: true,
          type: 'BOOKING',
          title: 'Đặt Phòng Mới',
          message: `Bạn đang chọn Phòng ${room.room_number} (${room.room_type}). Hãy điền thông tin để hoàn tất.`,
          onConfirm: async ({ name, phone }) => {
            handleCloseModal();
            const checkInDate = new Date(date);
            const checkOutDate = new Date(date);
            checkOutDate.setDate(checkOutDate.getDate() + 1);

            try {
              await axios.post('http://localhost:5000/api/bookings', {
                room_id: room.room_id,
                full_name: name,
                phone_number: phone,
                check_in_date: checkInDate.toISOString().split('T')[0],
                check_out_date: checkOutDate.toISOString().split('T')[0]
              });
              dispatch(fetchDashboardData());
            } catch (err) {
              alert('Lỗi khi đặt phòng: ' + err.message);
            }
          }
        });
      } else {
        alert('Phòng này đã có người đặt.');
      }
    } 
    else if (role === 'Receptionist') {
      if (status === 'Booked') {
        setModalConfig({
          isOpen: true,
          type: 'CONFIRM',
          title: 'Thủ tục Check-in',
          message: `Xác nhận khách hàng ${customerName} đã đến nhận phòng?`,
          onConfirm: async () => {
            handleCloseModal();
            await axios.put(`http://localhost:5000/api/bookings/${booking.booking_id}/status`, { status: 'Checked-in' });
            dispatch(fetchDashboardData());
          }
        });
      } else if (status === 'Checked-in') {
        setModalConfig({
          isOpen: true,
          type: 'CONFIRM',
          title: 'Thủ tục Check-out',
          message: `Xác nhận khách hàng ${customerName} trả phòng? Hệ thống sẽ ghi nhận phòng này trống.`,
          onConfirm: async () => {
            handleCloseModal();
            await axios.delete(`http://localhost:5000/api/bookings/${booking.booking_id}`);
            dispatch(fetchDashboardData());
          }
        });
      }
    }
    else if (role === 'Manager') {
      if (status !== 'Available') {
        setModalConfig({
          isOpen: true,
          type: 'CONFIRM',
          title: 'Quyền Quản Lý: Hủy Lịch',
          message: `Bạn có chắc chắn muốn XÓA/HỦY lịch đặt phòng của ${customerName}? Hành động này không thể hoàn tác.`,
          onConfirm: async () => {
            handleCloseModal();
            await axios.delete(`http://localhost:5000/api/bookings/${booking.booking_id}`);
            dispatch(fetchDashboardData());
          }
        });
      }
    }
  };

  // Theme Logic
  let bgStyle = {
    background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.1)'
  };
  let text = 'Book'; let icon = '✨';
  
  if (status === 'Booked') {
    bgStyle = {
      background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.15)'
    };
    text = customerName || 'Booked'; icon = '🕒';
  } else if (status === 'Checked-in') {
    bgStyle = {
      background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#60a5fa', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.15)'
    };
    text = customerName || 'Khách'; icon = '👤';
  }

  const isClickable = (role === 'Customer' && status === 'Available') || 
                      (role === 'Receptionist' && status !== 'Available') ||
                      (role === 'Manager' && status !== 'Available');

  const slotStyle = {
    ...bgStyle,
    padding: '12px 8px', borderRadius: '12px', minWidth: '130px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: '4px', fontWeight: '600', fontSize: '0.9rem',
    cursor: isClickable ? 'pointer' : 'default',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isClickable ? 1 : 0.6,
  };

  return (
    <>
      <div 
        style={slotStyle} 
        onClick={handleSlotClick} 
        title={isClickable ? "Bấm vào để thao tác" : "Không có quyền"}
        onMouseEnter={e => { 
          if(isClickable) {
            e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.2)';
          }
        }}
        onMouseLeave={e => { 
          if(isClickable) {
            e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)';
          }
        }}
      >
        <div style={{ fontSize: '1.2rem' }}>{icon}</div>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>{text}</div>
      </div>
      
      <PremiumModal 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={handleCloseModal}
        onConfirm={modalConfig.onConfirm}
      />
    </>
  );
};

export default RoomSlot;
