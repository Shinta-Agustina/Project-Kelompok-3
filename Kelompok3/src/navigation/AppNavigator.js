
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OwnerScreen from '../screens/owner/DashboardOwnerScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DashboardOwner"
        component={OwnerScreen}
      />
    </Stack.Navigator>
  );
}
