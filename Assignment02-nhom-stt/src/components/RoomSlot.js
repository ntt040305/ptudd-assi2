import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchDashboardData } from '../redux/roomSlice';
import axios from 'axios';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

const PremiumModal = ({ isOpen, type, title, message, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>{title}</Text>
          {message ? <Text style={modalStyles.message}>{message}</Text> : null}
          
          {type === 'BOOKING' && (
            <View style={{ marginBottom: 20 }}>
              <Text style={modalStyles.label}>Tên Khách Hàng</Text>
              <TextInput 
                style={modalStyles.input} 
                value={name} 
                onChangeText={setName} 
                placeholder="Nhập họ và tên..."
                placeholderTextColor="#94a3b8"
              />
              <Text style={modalStyles.label}>Số Điện Thoại</Text>
              <TextInput 
                style={modalStyles.input} 
                value={phone} 
                onChangeText={setPhone} 
                placeholder="Nhập số điện thoại..."
                placeholderTextColor="#94a3b8"
              />
            </View>
          )}

          <View style={modalStyles.actions}>
            <TouchableOpacity onPress={onClose} style={modalStyles.btnCancel}>
              <Text style={modalStyles.btnCancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                if (type === 'BOOKING') {
                  if (!name || !phone) return Alert.alert('Lỗi', 'Vui lòng nhập đủ thông tin!');
                  onConfirm({ name, phone });
                } else {
                  onConfirm();
                }
              }} 
              style={modalStyles.btnConfirm}
            >
              <Text style={modalStyles.btnConfirmText}>
                {type === 'BOOKING' ? 'Xác nhận Đặt' : 'Đồng ý'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1e293b',
    width: '85%',
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  message: {
    color: '#94a3b8',
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    color: '#cbd5e1',
    marginBottom: 5,
    fontSize: 13,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  btnCancel: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  btnCancelText: {
    color: '#cbd5e1',
    fontWeight: 'bold',
  },
  btnConfirm: {
    backgroundColor: '#ff5a5f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

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
          message: `Phòng ${room.room_number} (${room.room_type}).`,
          onConfirm: async ({ name, phone }) => {
            handleCloseModal();
            const checkInDate = new Date(date);
            const checkOutDate = new Date(date);
            checkOutDate.setDate(checkOutDate.getDate() + 1);

            try {
              await axios.post(`${API_URL}/api/bookings`, {
                room_id: room.room_id,
                full_name: name,
                phone_number: phone,
                check_in_date: checkInDate.toISOString().split('T')[0],
                check_out_date: checkOutDate.toISOString().split('T')[0]
              });
              dispatch(fetchDashboardData());
            } catch (err) {
              Alert.alert('Lỗi', err.message);
            }
          }
        });
      } else {
        Alert.alert('Lỗi', 'Phòng này đã có người đặt.');
      }
    } 
    else if (role === 'Receptionist') {
      if (status === 'Booked') {
        setModalConfig({
          isOpen: true,
          type: 'CONFIRM',
          title: 'Check-in',
          message: `Xác nhận khách hàng ${customerName} đã đến nhận phòng?`,
          onConfirm: async () => {
            handleCloseModal();
            await axios.put(`${API_URL}/api/bookings/${booking.booking_id}/status`, { status: 'Checked-in' });
            dispatch(fetchDashboardData());
          }
        });
      } else if (status === 'Checked-in') {
        setModalConfig({
          isOpen: true,
          type: 'CONFIRM',
          title: 'Check-out',
          message: `Xác nhận khách hàng ${customerName} trả phòng?`,
          onConfirm: async () => {
            handleCloseModal();
            await axios.delete(`${API_URL}/api/bookings/${booking.booking_id}`);
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
          title: 'Quản Lý: Hủy Lịch',
          message: `HỦY lịch của ${customerName}?`,
          onConfirm: async () => {
            handleCloseModal();
            await axios.delete(`${API_URL}/api/bookings/${booking.booking_id}`);
            dispatch(fetchDashboardData());
          }
        });
      }
    }
  };

  let bgStyle = { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' };
  let textColor = '#10b981';
  let text = 'Book'; let icon = '✨';
  
  if (status === 'Booked') {
    bgStyle = { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)' };
    textColor = '#fbbf24';
    text = customerName || 'Booked'; icon = '🕒';
  } else if (status === 'Checked-in') {
    bgStyle = { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)' };
    textColor = '#60a5fa';
    text = customerName || 'Khách'; icon = '👤';
  }

  const isClickable = (role === 'Customer' && status === 'Available') || 
                      (role === 'Receptionist' && status !== 'Available') ||
                      (role === 'Manager' && status !== 'Available');

  return (
    <>
      <TouchableOpacity 
        style={[styles.slot, bgStyle, { opacity: isClickable ? 1 : 0.6 }]} 
        onPress={handleSlotClick}
        disabled={!isClickable}
      >
        <Text style={{ fontSize: 16 }}>{icon}</Text>
        <Text style={[styles.text, { color: textColor }]} numberOfLines={1}>{text}</Text>
      </TouchableOpacity>
      
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

const styles = StyleSheet.create({
  slot: {
    borderWidth: 1,
    borderRadius: 12,
    flex: 1,
    width: '100%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
  }
});

export default RoomSlot;
