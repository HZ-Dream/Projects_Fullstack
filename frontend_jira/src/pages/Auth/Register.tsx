// React
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// API
import { postData } from '../../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = () => {
    try {
      postData('/api/auth/register', formData).then(res => {
          alert(`Đăng ký thành công, hãy đăng nhập bằng email ${res.email}!`);
          navigate('/login');
      })
    } catch (error) {
      alert('Đăng ký thất bại!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-sm shadow-xl w-full max-w-100 border border-gray-200">
        <h2 className="text-center text-gray-600 font-semibold mb-6 text-lg">Đăng ký tài khoản Jira</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full p-2 border-2 border-gray-200 rounded outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border-2 border-gray-200 rounded outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-2 border-2 border-gray-200 rounded outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
            Đăng ký
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Đã có tài khoản? <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;