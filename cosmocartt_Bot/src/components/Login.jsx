import React, { useState } from 'react';
import { Store, LayoutDashboard, User, Smartphone, ShieldCheck, Lock, ArrowRight, Settings, AlertCircle } from 'lucide-react';
import logo from '../assets/cosmocartt_logo.png';

const Login = ({ onLogin }) => {
    const [mode, setMode] = useState('MART'); // 'MART' or 'ADMIN'

    // Mart Inputs
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');

    // Admin Inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);

    // --- MART: DIRECT LOGIN ---
    const handleMartSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!name.trim() || !mobile.trim()) {
            setError('Please enter both name and mobile number.');
            return;
        }

        if (!/^\d{10}$/.test(mobile.trim())) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }

        // Pass user info back to parent
        onLogin(name, 'UID-' + mobile.slice(-4), 'user');
    };

    // --- ADMIN: LOGIN ---
    const handleAdminSubmit = (e) => {
        e.preventDefault();
        setError(null);
        if (email === 'demo' && password === '123') {
            onLogin('Admin', 'ADMIN-001', 'admin');
        } else {
            setError('Invalid credentials. Try demo / 123');
        }
    };

    return (
        // Changed overflow-hidden to overflow-y-auto and added py-10 so it scrolls if screen is small
        <div className="min-h-screen w-full flex items-center justify-center p-4 py-10 relative bg-[#f3e8ff] overflow-y-auto">
            {/* Animated Background Elements */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/40 blur-[120px] rounded-full animate-pulse"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-300/40 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-md z-10 flex flex-col items-center justify-center relative">
                {/* Logo Section - Reduced margin to pull up */}
                <div className="text-center mb-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <img
                        src={logo}
                        alt="CosmoCart Logo"
                        // Reduced logo size slightly (w-52 -> w-44) to save space
                        className="w-44 mx-auto drop-shadow-lg object-contain"
                    />
                </div>

                {/* Login Card - Reduced padding (p-8 -> p-6) to make it shorter */}
                <div className="w-full bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(88,28,135,0.15)] relative overflow-hidden border border-white/60 ring-1 ring-purple-100 animate-in fade-in zoom-in-95 duration-500">

                    {/* Tabs/Toggle Switch - Reduced bottom margin (mb-8 -> mb-6) */}
                    <div className="relative flex p-1 bg-purple-50/80 rounded-xl mb-6 border border-purple-100 shadow-inner">
                        <div
                            className={`absolute inset-y-1 w-[calc(50%-4px)] bg-purple-900 rounded-lg transition-all duration-500 ease-out shadow-md ${mode === 'ADMIN' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
                        ></div>

                        <button
                            type="button"
                            onClick={() => { setMode('MART'); setError(null); }}
                            className={`flex-1 py-2.5 text-xs font-black relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 uppercase tracking-tighter ${mode === 'MART' ? 'text-white' : 'text-purple-400 hover:text-purple-600'}`}
                        >
                            <Store className="w-3.5 h-3.5" /> Mart Portal
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('ADMIN'); setError(null); }}
                            className={`flex-1 py-2.5 text-xs font-black relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 uppercase tracking-tighter ${mode === 'ADMIN' ? 'text-white' : 'text-purple-400 hover:text-purple-600'}`}
                        >
                            <LayoutDashboard className="w-3.5 h-3.5" /> Admin Hub
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2 flex gap-2 items-center">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    {/* MART PORTAL */}
                    {mode === 'MART' ? (
                        <form onSubmit={handleMartSubmit} className="space-y-4 animate-in fade-in duration-500">
                            <div className="space-y-3">
                                <div className="relative group">
                                    <User className="absolute left-4 top-3.5 text-purple-300 group-focus-within:text-purple-600 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        // Reduced padding (p-4 -> p-3) to make inputs slimmer
                                        className="w-full bg-purple-50/50 border border-purple-100 p-3 pl-12 rounded-xl outline-none focus:border-purple-600 focus:bg-white text-purple-900 font-bold placeholder:text-purple-300 transition-all shadow-sm"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <Smartphone className="absolute left-4 top-3.5 text-purple-300 group-focus-within:text-purple-600 transition-colors w-5 h-5" />
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="w-full bg-purple-50/50 border border-purple-100 p-3 pl-12 rounded-xl outline-none focus:border-purple-600 focus:bg-white text-purple-900 font-bold placeholder:text-purple-300 transition-all shadow-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-purple-900 text-white rounded-xl font-black text-lg hover:bg-purple-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-900/20 active:scale-95 mt-2"
                            >
                                Enter Mart <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    ) : (
                        /* ADMIN HUB */
                        <form onSubmit={handleAdminSubmit} className="space-y-4 animate-in fade-in duration-500">
                            <div className="space-y-3">
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-3.5 text-purple-300 group-focus-within:text-purple-600 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Admin Email / ID"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-purple-50/50 border border-purple-100 p-3 pl-12 rounded-xl outline-none focus:border-purple-600 focus:bg-white text-purple-900 font-bold placeholder:text-purple-300 transition-all shadow-sm"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 text-purple-300 group-focus-within:text-purple-600 transition-colors w-5 h-5" />
                                    <input
                                        type="password"
                                        placeholder="Security Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-purple-50/50 border border-purple-100 p-3 pl-12 rounded-xl outline-none focus:border-purple-600 focus:bg-white text-purple-900 font-bold placeholder:text-purple-300 transition-all shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3.5 bg-purple-950 text-white rounded-xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95 group mt-2">
                                Access Dashboard <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                            </button>
                        </form>
                    )}

                    <div className="mt-6 flex flex-col items-center">
                        <div className="w-12 h-px bg-purple-100 mb-3"></div>
                        <p className="text-[10px] text-purple-300 uppercase tracking-[0.3em] font-black italic">CosmoCartt Global</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
