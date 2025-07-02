import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    FileText,
    Calendar,
    User,
    Activity
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth();

    const adminNavItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/patients', icon: Users, label: 'Patients' },
        { to: '/incidents', icon: FileText, label: 'Appointments' },
        { to: '/calendar', icon: Calendar, label: 'Calendar' },
    ];

    const patientNavItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/patient-view', icon: User, label: 'My Profile' },
    ];

    const navItems = user?.role === 'Admin' ? adminNavItems : patientNavItems;

    return (
        <div className="bg-white w-64 min-h-screen shadow-lg">
            <div className="p-6">
                <div className="flex items-center space-x-2">
                    <Activity className="h-8 w-8 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-800">DentalCare</h2>
                </div>
            </div>
            <nav className="mt-6">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors ${isActive ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' : ''
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar; 