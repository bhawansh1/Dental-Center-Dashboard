import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
    User,
    Calendar,
    Clock,
    FileText,
    Download,
    Eye,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const PatientView = () => {
    const { user } = useAuth();
    const { patients, incidents } = useData();
    const [selectedIncident, setSelectedIncident] = useState(null);

    const patient = patients.find(p => p.id === user.patientId);
    const patientIncidents = incidents.filter(i => i.patientId === user.patientId);

    const upcomingAppointments = patientIncidents
        .filter(i => new Date(i.appointmentDate) >= new Date())
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

    const pastAppointments = patientIncidents
        .filter(i => new Date(i.appointmentDate) < new Date())
        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-yellow-100 text-yellow-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleFileDownload = (file) => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!patient) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Patient Profile Not Found</h2>
                    <p className="text-gray-600">Unable to load your patient information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>

            {/* Patient Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                    <div className="bg-primary-100 p-3 rounded-full">
                        <User className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="ml-4">
                        <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
                        <p className="text-gray-600">{patient.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                        <p className="text-gray-900">{new Date(patient.dob).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
                        <p className="text-gray-900">{patient.contact}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Patient Since</label>
                        <p className="text-gray-900">{new Date(patient.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {patient.healthInfo && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-500 mb-2">Health Information</label>
                        <p className="text-gray-900">{patient.healthInfo}</p>
                    </div>
                )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-md">
                            <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                            <p className="text-2xl font-semibold text-gray-900">{patientIncidents.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-md">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {patientIncidents.filter(i => i.status === 'Completed').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-2 rounded-md">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Upcoming</p>
                            <p className="text-2xl font-semibold text-gray-900">{upcomingAppointments.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
                    <div className="space-y-4">
                        {upcomingAppointments.map(appointment => (
                            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-3">{appointment.description}</p>

                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                                    <Clock className="h-4 w-4 ml-4 mr-2" />
                                    {new Date(appointment.appointmentDate).toLocaleTimeString()}
                                </div>

                                {appointment.comments && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Comments:</span> {appointment.comments}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Treatment History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Treatment History</h2>
                {pastAppointments.length > 0 ? (
                    <div className="space-y-4">
                        {pastAppointments.map(appointment => (
                            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                                    <div className="flex items-center space-x-2">
                                        {appointment.cost && (
                                            <span className="text-sm font-medium text-green-600">${appointment.cost}</span>
                                        )}
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-3">{appointment.description}</p>

                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                                    <Clock className="h-4 w-4 ml-4 mr-2" />
                                    {new Date(appointment.appointmentDate).toLocaleTimeString()}
                                </div>

                                {appointment.treatment && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Treatment:</span> {appointment.treatment}
                                        </p>
                                    </div>
                                )}

                                {appointment.files && appointment.files.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Files:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {appointment.files.map((file, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleFileDownload(file)}
                                                    className="flex items-center space-x-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                                                >
                                                    <FileText className="h-3 w-3" />
                                                    <span>{file.name}</span>
                                                    <Download className="h-3 w-3" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {appointment.nextDate && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Next Appointment:</span>{' '}
                                            {new Date(appointment.nextDate).toLocaleDateString()} at{' '}
                                            {new Date(appointment.nextDate).toLocaleTimeString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No treatment history available.</p>
                )}
            </div>
        </div>
    );
};

export default PatientView; 