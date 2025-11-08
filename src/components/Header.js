import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Medical Center Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                            {user?.name || user?.email}
                        </span>
                        <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                            {user?.role}
                        </span>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header; 