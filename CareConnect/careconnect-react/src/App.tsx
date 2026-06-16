import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useAccountStore } from './store/accountStore'
import LoginScreen from './screens/LoginScreen'
import CreateAccountScreen from './screens/CreateAccountScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import DashboardScreen from './screens/DashboardScreen'
import HealthMetricsScreen from './screens/HealthMetricsScreen'
import HealthReportsScreen from './screens/HealthReportsScreen'
import PharmacyScreen from './screens/PharmacyScreen'
import UserProfileScreen from './screens/UserProfileScreen'
import SettingsScreen from './screens/SettingsScreen'

export type RootStackParamList = {
  Login: undefined
  CreateAccount: undefined
  ForgotPassword: undefined
  Dashboard: undefined
  HealthMetrics: undefined
  HealthReports: undefined
  Pharmacy: undefined
  Profile: undefined
  Settings: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const isLoggedIn = useAccountStore(s => s.isLoggedIn)

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          {!isLoggedIn ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="HealthMetrics" component={HealthMetricsScreen} />
              <Stack.Screen name="HealthReports" component={HealthReportsScreen} />
              <Stack.Screen name="Pharmacy" component={PharmacyScreen} />
              <Stack.Screen name="Profile" component={UserProfileScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
