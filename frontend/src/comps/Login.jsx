import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, LogIn, Loader2, XCircle } from 'lucide-react';
import axios from 'axios';

const LoginForm = (props) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await axios.post('http://127.0.0.1:5000/users/login', {
                username: formData.username,
                password: formData.password
            });

            if (response.status === 200) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('isAuthenticated', 'true');
                props.onLogin(); // Call the parent's login handler
                window.location.href = '/dashboard';
            }
        } catch (error) {
            if (error.response) {
                const { status } = error.response;

                switch (status) {
                    case 400:
                        setErrors({ general: 'Username and password are required' });
                        break;
                    case 401:
                        setErrors({ general: 'Invalid username or password' });
                        break;
                    default:
                        setErrors({ general: 'An unexpected error occurred. Please try again.' });
                }
            } else {
                setErrors({ general: 'Network error. Please check your connection.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md border border-blue-100">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-blue-800 mb-2">Welcome Back</h1>
                        <p className="text-blue-600">Sign in to access your account</p>
                    </div>

                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center space-x-2 text-red-700">
                                <XCircle className="w-5 h-5" />
                                <span className="font-medium">{errors.general}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-blue-800 mb-1">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-blue-400" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.username
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                                            : 'border-blue-200 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    placeholder="Enter your username"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                                    <XCircle className="w-4 h-4" />
                                    <span>{errors.username}</span>
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-blue-800 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-blue-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                                            : 'border-blue-200 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-blue-400 hover:text-blue-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-blue-400 hover:text-blue-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                                    <XCircle className="w-4 h-4" />
                                    <span>{errors.password}</span>
                                </p>
                            )}
                        </div>

                        {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-800">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div> */}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Signing In...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2">
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-blue-600">
                            Don't have an account?{' '}
                            <a href="/register" className="font-medium text-blue-800 hover:text-blue-600">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;