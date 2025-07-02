import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Incidents from './pages/Incidents';
import Calendar from './pages/Calendar';
import PatientView from './pages/PatientView';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <Router>
                    <div className="min-h-screen bg-gray-50">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }>
                                <Route index element={<Navigate to="/dashboard" replace />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="patients" element={
                                    <ProtectedRoute requiredRole="Admin">
                                        <Patients />
                                    </ProtectedRoute>
                                } />
                                <Route path="incidents" element={
                                    <ProtectedRoute requiredRole="Admin">
                                        <Incidents />
                                    </ProtectedRoute>
                                } />
                                <Route path="calendar" element={
                                    <ProtectedRoute requiredRole="Admin">
                                        <Calendar />
                                    </ProtectedRoute>
                                } />
                                <Route path="patient-view" element={
                                    <ProtectedRoute requiredRole="Patient">
                                        <PatientView />
                                    </ProtectedRoute>
                                } />
                            </Route>
                        </Routes>
                    </div>
                </Router>
            </DataProvider>
        </AuthProvider>
    );
}

export default App; 