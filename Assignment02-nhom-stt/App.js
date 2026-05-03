import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  return (
    <Provider store={store}>
      <DashboardScreen />
    </Provider>
  );
}
