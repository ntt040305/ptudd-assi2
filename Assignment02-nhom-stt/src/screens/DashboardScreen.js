import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../redux/roomSlice';
import Calendar from '../components/Calendar';
import { StatusBar } from 'expo-status-bar';

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const { data: roomsData, status, error } = useSelector((state) => state.rooms);
  
  const [role, setRole] = useState('Customer');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (status === 'loading' && roomsData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading Hotel Data...</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const renderRoleButton = (title, r) => (
    <TouchableOpacity 
      style={[styles.roleBtn, role === r && styles.roleBtnActive]} 
      onPress={() => setRole(r)}
    >
      <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>
            <Text style={{ color: '#fff' }}>Hotel</Text>
            <Text style={{ color: '#ff5a5f' }}>Tonight</Text>
          </Text>
          <Text style={styles.subtitle}>Premium booking management</Text>
        </View>

        <View style={styles.glassPanel}>
          <Text style={styles.roleTitle}>CURRENT VIEW</Text>
          <View style={styles.roleTabs}>
            {renderRoleButton('Customer', 'Customer')}
            {renderRoleButton('Reception', 'Receptionist')}
            {renderRoleButton('Manager', 'Manager')}
          </View>
        </View>

        <Text style={styles.instruction}>
          {role === 'Customer' ? '✨ Tap on any glowing green slot to book.' : 
           role === 'Receptionist' ? '⚡ Tap amber slots to Check-In, blue to Check-Out.' : 
           '🛡️ Tap any occupied slot to cancel bookings.'}
        </Text>

        <Calendar roomsData={roomsData} role={role} />

        <View style={[styles.glassPanel, styles.legendPanel]}>
          <View style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: '#10b981' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6' }]} />
            <Text style={styles.legendText}>Checked-in</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ff5a5f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff5a5f',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 5,
  },
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  roleTitle: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 15,
  },
  roleTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal: 5,
  },
  roleBtnActive: {
    backgroundColor: 'rgba(255, 90, 95, 0.15)',
    borderColor: 'rgba(255, 90, 95, 0.5)',
  },
  roleBtnText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 13,
  },
  roleBtnTextActive: {
    color: '#ff5a5f',
  },
  instruction: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  legendPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  legendText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '500',
  }
});

export default DashboardScreen;
