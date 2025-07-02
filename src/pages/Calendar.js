import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

const Calendar = () => {
    const { patients, incidents } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getAppointmentsForDate = (date) => {
        if (!date) return [];

        return incidents.filter(incident => {
            const appointmentDate = new Date(incident.appointmentDate);
            return appointmentDate.toDateString() === date.toDateString();
        });
    };

    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        return patient ? patient.name : 'Unknown Patient';
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const days = getDaysInMonth(currentDate);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 bg-gray-50">
                            {dayNames.map(day => (
                                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7">
                            {days.map((date, index) => {
                                const appointments = getAppointmentsForDate(date);
                                const isCurrentDay = isToday(date);

                                return (
                                    <div
                                        key={index}
                                        className={`min-h-[100px] p-2 border-r border-b border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors ${!date ? 'bg-gray-50' : ''
                                            } ${isCurrentDay ? 'bg-blue-50' : ''} ${selectedDate && date && selectedDate.toDateString() === date.toDateString() ? 'bg-primary-100' : ''
                                            }`}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        {date && (
                                            <>
                                                <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}`}>
                                                    {date.getDate()}
                                                </div>
                                                <div className="space-y-1">
                                                    {appointments.slice(0, 3).map(appointment => (
                                                        <div
                                                            key={appointment.id}
                                                            className={`text-xs p-1 rounded truncate ${appointment.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                                                    appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                                        'bg-red-100 text-red-800'
                                                                }`}
                                                        >
                                                            {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appointment.title}
                                                        </div>
                                                    ))}
                                                    {appointments.length > 3 && (
                                                        <div className="text-xs text-gray-500">
                                                            +{appointments.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Selected Date Details */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}
                        </h3>

                        {selectedDate && (
                            <>
                                <div className="space-y-3">
                                    {getAppointmentsForDate(selectedDate).length > 0 ? (
                                        getAppointmentsForDate(selectedDate).map(appointment => (
                                            <div key={appointment.id} className="border border-gray-200 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${appointment.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                                            appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {appointment.status}
                                                    </span>
                                                </div>

                                                <h4 className="font-medium text-gray-900 mb-1">{appointment.title}</h4>
                                                <p className="text-sm text-gray-600 mb-2">{getPatientName(appointment.patientId)}</p>

                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {new Date(appointment.appointmentDate).toLocaleTimeString()}
                                                </div>

                                                <p className="text-sm text-gray-600">{appointment.description}</p>

                                                {appointment.treatment && (
                                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                                        <p className="text-xs text-gray-500 mb-1">Treatment:</p>
                                                        <p className="text-sm text-gray-700">{appointment.treatment}</p>
                                                    </div>
                                                )}

                                                {appointment.cost && (
                                                    <div className="mt-2 text-sm font-medium text-green-600">
                                                        Cost: ${appointment.cost}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No appointments scheduled for this date.</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar; 