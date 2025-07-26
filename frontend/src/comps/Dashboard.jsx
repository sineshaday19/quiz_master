import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Settings,
    BookOpen,
    ClipboardList,
    BarChart2,
    FileText,
    Menu,
    X
} from 'lucide-react';
import UserManagement from './userManagement';
import QuestionManagement from './QuizManage';
import QuizReport from './QuizReport';
import { TakeQuiz } from './TakeQuiz';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    // const [activeTab, setActiveTab] = useState('dashboard');
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'dashboard');

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    useEffect(() => {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUser(userData);
            setIsAdmin(userData.is_admin === 1); // Assuming 1 is admin, 0 is regular user
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('activeTab', activeTab);
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.removeItem('activeTab');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
    };

    const adminNavItems = [
        { id: 'dashboard2', label: 'Dashboard2', icon: <LayoutDashboard size={20} /> },
        { id: 'users', label: 'User Management', icon: <Users size={20} /> },
        { id: 'reports', label: 'Reports', icon: <BarChart2 size={20} /> },
        { id: 'content', label: 'Content Management', icon: <BookOpen size={20} /> },
        // { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
    ];

    const userNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'quizzes', label: 'My Quizzes', icon: <ClipboardList size={20} /> },
        { id: 'results', label: 'My Results', icon: <FileText size={20} /> },
        // { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
    ];

    const navItems = isAdmin ? adminNavItems : userNavItems;

    const renderContent = () => {
        switch (activeTab) {
            case 'content':
                return (
                    <QuestionManagement />
                )
            case 'quizzes':
                return (
                    <TakeQuiz />
                );
            case 'dashboard':
                return (
                    <TakeQuiz />
                );
            case 'dashboard2':
                return (
                    <QuestionManagement />
                );
            case 'users':
                return (
                    <UserManagement />
                );
            case 'reports':
                return (
                    <QuizReport />
                );
            // Add more cases for other tabs
            default:
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <p>Content for {activeTab} will appear here.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile sidebar toggle button */}
            <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
            >
                <Menu size={24} />
            </button>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-64 bg-blue-800 text-white transition-transform duration-300 ease-in-out z-40`}>
                <div className="flex items-center justify-between p-4 border-b border-blue-700">
                    <h1 className="text-xl font-bold">Quiz Platform</h1>
                    <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="md:hidden p-1 rounded-md hover:bg-blue-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex items-center space-x-3 mb-6 p-2 bg-blue-700 rounded-lg">
                        <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="font-medium">{user?.username || 'User'}</p>
                            <p className="text-xs text-blue-200">{isAdmin ? 'Admin' : 'User'}</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                            >
                                <span className="text-blue-200">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left hover:bg-blue-700 transition-colors"
                    >
                        <Settings size={20} className="text-blue-200" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm">
                    <div className="px-6 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-semibold text-gray-800">
                            {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                                </button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-800 font-medium">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="hidden md:inline text-sm font-medium">{user?.username || 'User'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;