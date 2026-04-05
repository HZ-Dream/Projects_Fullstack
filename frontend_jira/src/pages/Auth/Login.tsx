// React
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// API
import { postData } from '../../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    try {
      postData('/api/auth/login', { email, password }).then(res => {
          localStorage.setItem('tokenJira', res.token); 
          alert('Đăng nhập thành công!');
          navigate('/'); 
      })
    } catch (error) {
      alert('Sai tài khoản hoặc mật khẩu');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Logo giả lập Jira */}
      <div className="flex items-center mb-8 gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-sm transform rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
        <span className="text-2xl font-bold text-slate-700">Jira Clone</span>
      </div>

      <div className="bg-white p-8 rounded-sm shadow-xl w-full max-w-100 border border-gray-200">
        <h2 className="text-center text-gray-600 font-semibold mb-6 text-lg">Đăng nhập để tiếp tục</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Nhập email"
            className="w-full p-2 border-2 border-gray-200 rounded focus:border-blue-500 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            className="w-full p-2 border-2 border-gray-200 rounded focus:border-blue-500 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm">
          <Link to="/register" className="text-blue-600 hover:underline">Tạo tài khoản mới</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;