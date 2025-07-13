import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
    users: User[];
    onLogin: (user: User) => void;
    onRegister: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ users, onLogin, onRegister }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (username.trim() === '' || password.trim() === '') {
            setError('Username and password are required.');
            return;
        }

        if (isLogin) {
            const user = users.find(u => u.username === username);
            if (user && user.password === password) {
                onLogin(user);
            } else {
                setError('Invalid username or password.');
            }
        } else {
            // Register
            if (users.some(u => u.username === username)) {
                setError('Username already exists. Please choose another.');
            } else {
                onRegister({ username, password });
            }
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full p-4">
            <div className="w-full max-w-sm mx-auto bg-white/30 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down">
                <div className="p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">CURA</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Your personal healthcare assistant.</p>
                        <p className="text-slate-600 dark:text-slate-300 mt-4 font-semibold">{isLogin ? 'Sign in to your account' : 'Create your account'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-11 px-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-200 transition-all duration-300"
                                placeholder="e.g., john_doe"
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-11 px-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-200 transition-all duration-300"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="w-full h-11 flex items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:from-slate-400 disabled:to-slate-500"
                            >
                                {isLogin ? 'Login' : 'Register'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-6">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 transition"
                        >
                            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;