import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });

            // Store the JWT token and role in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.user.role);
            localStorage.setItem('userID', response.data.user.user_id);

            setSuccess(response.data.message);
            setError('');

            const role = response.data.user.role;

            // Redirect based on the user's role
            if (response.data.message === "Login successful" && role === "admin") {
                navigate('/dashboard');
            } else if (response.data.message === "Login successful" && role === "learner") {
                navigate('/student-dashboard');
            } else if (role === "teacher") {
                navigate('/teacher-dashboard');
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Login failed');
            setSuccess('');
        }
    };

    return (
        <div className="font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
                    <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                            <div className="mb-8 flex flex-col items-center justify-center">
                                <h1 className="text-xl text-gray-500 mb-5">
                                    <span className="eb-garamond-normal font-bold text-indigo-600 text-4xl">Learn</span>
                                    <span className="font-mono text-3xl">Globs</span>
                                </h1>
                                <h3 className="text-gray-800 text-2xl font-extrabold font-sans">Welcome Back</h3>
                                <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                                    Sign in to your account and explore a world of possibilities. Your journey begins here.
                                </p>
                            </div>

                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

                            <div className="!mt-8">
                                <button
                                    type="button"
                                    className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                    onClick={handleLogin}
                                >
                                    Log in
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
                        <img
                            src="https://readymadeui.com/login-image.webp"
                            className="w-full h-full max-md:w-4/5 mx-auto block object-cover"
                            alt="Dining Experience"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;