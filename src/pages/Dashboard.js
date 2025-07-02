import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
    Users,
    Calendar,
    DollarSign,
    Activity,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const { patients, incidents } = useData();

    // Calculate KPIs
    const totalPatients = patients.length;
    const totalIncidents = incidents.length;
    const completedTreatments = incidents.filter(i => i.status === 'Completed').length;
    const pendingTreatments = incidents.filter(i => i.status === 'Scheduled').length;
    const totalRevenue = incidents
        .filter(i => i.status === 'Completed' && i.cost)
        .reduce((sum, i) => sum + (i.cost || 0), 0);

    // Get upcoming appointments (next 10)
    const upcomingAppointments = incidents
        .filter(i => new Date(i.appointmentDate) >= new Date())
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 10);

    // Get top patients (by number of appointments)
    const patientAppointmentCounts = patients.map(patient => ({
        ...patient,
        appointmentCount: incidents.filter(i => i.patientId === patient.id).length
    })).sort((a, b) => b.appointmentCount - a.appointmentCount).slice(0, 5);

    const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
                <div className={`p-2 rounded-md ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                </div>
            </div>
        </div>
    );

    if (user.role === 'Patient') {
        // Patient Dashboard
        const userPatient = patients.find(p => p.id === user.patientId);
        const userIncidents = incidents.filter(i => i.patientId === user.patientId);
        const userUpcoming = userIncidents
            .filter(i => new Date(i.appointmentDate) >= new Date())
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome, {userPatient?.name}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Appointments"
                        value={userIncidents.length}
                        icon={Calendar}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Completed"
                        value={userIncidents.filter(i => i.status === 'Completed').length}
                        icon={CheckCircle}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Upcoming"
                        value={userUpcoming.length}
                        icon={Clock}
                        color="bg-yellow-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
                        {userUpcoming.length > 0 ? (
                            <div className="space-y-3">
                                {userUpcoming.slice(0, 5).map(appointment => (
                                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{appointment.title}</p>
                                            <p className="text-sm text-gray-600">{appointment.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(appointment.appointmentDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(appointment.appointmentDate).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No upcoming appointments</p>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Treatments</h2>
                        {userIncidents.filter(i => i.status === 'Completed').length > 0 ? (
                            <div className="space-y-3">
                                {userIncidents
                                    .filter(i => i.status === 'Completed')
                                    .slice(0, 5)
                                    .map(treatment => (
                                        <div key={treatment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{treatment.title}</p>
                                                <p className="text-sm text-gray-600">{treatment.treatment}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-green-600">${treatment.cost}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(treatment.appointmentDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No completed treatments</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Patients"
                    value={totalPatients}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${totalRevenue}`}
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <StatCard
                    title="Completed Treatments"
                    value={completedTreatments}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
                <StatCard
                    title="Pending Treatments"
                    value={pendingTreatments}
                    icon={AlertCircle}
                    color="bg-yellow-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Next 10 Appointments</h2>
                    {upcomingAppointments.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingAppointments.map(appointment => {
                                const patient = patients.find(p => p.id === appointment.patientId);
                                return (
                                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{patient?.name}</p>
                                            <p className="text-sm text-gray-600">{appointment.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(appointment.appointmentDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(appointment.appointmentDate).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500">No upcoming appointments</p>
                    )}
                </div>

                {/* Top Patients */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Patients</h2>
                    {patientAppointmentCounts.length > 0 ? (
                        <div className="space-y-3">
                            {patientAppointmentCounts.map(patient => (
                                <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{patient.name}</p>
                                        <p className="text-sm text-gray-600">{patient.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {patient.appointmentCount} appointments
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No patients found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 