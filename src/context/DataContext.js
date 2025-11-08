import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

// Mock data initialization
const initializeData = () => {
    const mockData = {
        users: [
            { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123", name: "Dr. Smith" },
            { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1", name: "John Doe" }
        ],
        patients: [
            {
                id: "p1",
                name: "John Doe",
                dob: "1990-05-10",
                contact: "1234567890",
                email: "john@entnt.in",
                healthInfo: "No allergies",
                createdAt: "2024-01-01"
            }
        ],
        incidents: [
            {
                id: "i1",
                patientId: "p1",
                title: "General Checkup",
                description: "Annual medical checkup",
                comments: "All tests completed",
                appointmentDate: "2025-01-15T10:00:00",
                cost: 100,
                treatment: "General examination and blood work",
                status: "Scheduled",
                nextDate: "2025-01-22T10:00:00",
                files: []
            }
        ]
    };

    // Initialize localStorage if empty
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(mockData.users));
    }
    if (!localStorage.getItem('patients')) {
        localStorage.setItem('patients', JSON.stringify(mockData.patients));
    }
    if (!localStorage.getItem('incidents')) {
        localStorage.setItem('incidents', JSON.stringify(mockData.incidents));
    }
};

export const DataProvider = ({ children }) => {
    const [patients, setPatients] = useState([]);
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        initializeData();
        loadData();
    }, []);

    const loadData = () => {
        const patientsData = JSON.parse(localStorage.getItem('patients') || '[]');
        const incidentsData = JSON.parse(localStorage.getItem('incidents') || '[]');
        setPatients(patientsData);
        setIncidents(incidentsData);
    };

    const savePatients = (newPatients) => {
        localStorage.setItem('patients', JSON.stringify(newPatients));
        setPatients(newPatients);
    };

    const saveIncidents = (newIncidents) => {
        localStorage.setItem('incidents', JSON.stringify(newIncidents));
        setIncidents(newIncidents);
    };

    const addPatient = (patient) => {
        const newPatient = {
            ...patient,
            id: 'p' + Date.now(),
            createdAt: new Date().toISOString()
        };
        const updatedPatients = [...patients, newPatient];
        savePatients(updatedPatients);
        return newPatient;
    };

    const updatePatient = (id, updatedData) => {
        const updatedPatients = patients.map(p =>
            p.id === id ? { ...p, ...updatedData } : p
        );
        savePatients(updatedPatients);
    };

    const deletePatient = (id) => {
        const updatedPatients = patients.filter(p => p.id !== id);
        const updatedIncidents = incidents.filter(i => i.patientId !== id);
        savePatients(updatedPatients);
        saveIncidents(updatedIncidents);
    };

    const addIncident = (incident) => {
        const newIncident = {
            ...incident,
            id: 'i' + Date.now(),
            files: incident.files || []
        };
        const updatedIncidents = [...incidents, newIncident];
        saveIncidents(updatedIncidents);
        return newIncident;
    };

    const updateIncident = (id, updatedData) => {
        const updatedIncidents = incidents.map(i =>
            i.id === id ? { ...i, ...updatedData } : i
        );
        saveIncidents(updatedIncidents);
    };

    const deleteIncident = (id) => {
        const updatedIncidents = incidents.filter(i => i.id !== id);
        saveIncidents(updatedIncidents);
    };

    const value = {
        patients,
        incidents,
        addPatient,
        updatePatient,
        deletePatient,
        addIncident,
        updateIncident,
        deleteIncident,
        loadData
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}; 