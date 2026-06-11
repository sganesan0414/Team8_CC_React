import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAccountStore } from './store/accountStore'
import LoginScreen from './screens/LoginScreen'
import CreateAccountScreen from './screens/CreateAccountScreen'
import DashboardScreen from './screens/DashboardScreen'
import HealthMetricsScreen from './screens/HealthMetricsScreen'
import HealthReportsScreen from './screens/HealthReportsScreen'
import PharmacyScreen from './screens/PharmacyScreen'
import UserProfileScreen from './screens/UserProfileScreen'
import SettingsScreen from './screens/SettingsScreen'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAccountStore(s => s.isLoggedIn)
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/create-account" element={<CreateAccountScreen />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
        <Route path="/health-metrics" element={<ProtectedRoute><HealthMetricsScreen /></ProtectedRoute>} />
        <Route path="/health-reports" element={<ProtectedRoute><HealthReportsScreen /></ProtectedRoute>} />
        <Route path="/pharmacy" element={<ProtectedRoute><PharmacyScreen /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfileScreen /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
