import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Infinity, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/abacco/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", "logged-in");
        localStorage.setItem("admin", JSON.stringify(data.data));
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Server not running or wrong API URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DDE2E7] p-6">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-500">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#FF5722] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-orange-200 mb-4">
            <Infinity className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-[#1A1A1A] uppercase italic">
            SCHOOL<span className="text-gray-400 not-italic">HUB</span>
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">
            Enterprise Management Suite
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-[#F3F5F7] p-10 rounded-[3rem] shadow-2xl shadow-black/5 border border-white relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF5722] to-transparent opacity-20" />
          
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-8 tracking-tight">
            Account Login
          </h2>

          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative group">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2 block">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5722] transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-white border border-transparent focus:border-gray-200 py-4 pl-14 pr-6 rounded-2xl text-sm font-bold transition-all outline-none shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2 block">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5722] transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white border border-transparent focus:border-gray-200 py-4 pl-14 pr-6 rounded-2xl text-sm font-bold transition-all outline-none shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full mt-10 bg-[#1A1A1A] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#FF5722] transition-all shadow-xl shadow-black/10 disabled:opacity-50 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Authorize Access
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-center mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            Authorized Personnel Only • Secure Session
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;