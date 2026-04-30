import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import DashboardScreen from './screens/DashboardScreen';

function App() {
  return (
    <Provider store={store}>
      <DashboardScreen />
    </Provider>
  );
}

export default App;
