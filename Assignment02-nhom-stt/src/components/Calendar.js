import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import RoomSlot from './RoomSlot';

const Calendar = ({ roomsData, role }) => {
  const today = new Date('2026-05-01');
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  return (
    <View style={styles.glassPanel}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableContainer}>
          {/* Header */}
          <View style={styles.row}>
            <View style={[styles.headerCell, { width: 80 }]}><Text style={styles.headerText}>Room</Text></View>
            <View style={[styles.headerCell, { width: 100 }]}><Text style={styles.headerText}>Type</Text></View>
            {dates.map(date => {
              const [y, m, d] = date.split('-');
              return (
                <View key={date} style={[styles.headerCell, { width: 130 }]}>
                  <Text style={styles.headerDateSub}>{m}/{y}</Text>
                  <Text style={styles.headerDateMain}>{d}</Text>
                </View>
              );
            })}
          </View>

          {/* Body */}
          {roomsData.map(room => (
            <View key={room.room_id} style={styles.row}>
              <View style={[styles.cell, { width: 80 }]}>
                <Text style={styles.roomNumber}>{room.room_number}</Text>
              </View>
              <View style={[styles.cell, { width: 100 }]}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{room.room_type}</Text>
                </View>
              </View>
              {dates.map(date => {
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

                return (
                  <View key={date} style={[styles.cell, { width: 130, padding: 4 }]}>
                    <RoomSlot 
                      status={status} 
                      customerName={customerName} 
                      date={date}
                      room={room}
                      role={role}
                      booking={booking}
                    />
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tableContainer: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 10,
  },
  headerCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: 14,
  },
  headerDateSub: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  headerDateMain: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  roomNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#cbd5e1',
    fontSize: 12,
    textTransform: 'capitalize',
  }
});

export default Calendar;
