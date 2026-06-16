import { Input, Label } from '@heroui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import SEO from '../../components/seo/SEO'

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/login', { username, password });
            
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/dashboard'); 
        } catch (err) {
            if (err.response && err.response.data) {
                const backendError = err.response.data.errors?.username?.[0] || err.response.data.message;
                setError(backendError || 'Invalid login credentials.');
            } else {
                setError('Unable to connect to the server. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className='flex flex-col min-h-[80vh] w-full items-center justify-center p-4'>
            <SEO 
                            title="Inventory Management By AkYamin"
                            desc="Assessment Test Project"
                            url={"https://invmng.nmyk.space"}
                            image={``} 
            />
            <form onSubmit={handleLogin} className='w-full max-w-md items-center justify-center flex flex-col gap-y-6'>
                
                <div className='text-center mb-4'>
                    <h1 className='font-bold text-2xl'>Inventory Management</h1>
                </div>

                {error && (
                    <div className="w-80 p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <div className='flex w-80 flex-col gap-4'>
                    <div className='flex flex-col gap-1 text-left'>
                        <Label htmlFor='input-type-username'>Username</Label>
                        <Input 
                            id='input-type-username' 
                            placeholder='johndoe' 
                            type='text' 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex flex-col gap-1 text-left'>
                        <Label htmlFor='input-type-password'>Password</Label>
                        <Input 
                            id='input-type-password' 
                            placeholder='••••••••' 
                            type='password' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className='flex justify-end'>
                         <a href='/forgetpassword' className='text-xs text-green-600 hover:underline'>Forgot Password?</a>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className='w-full px-6 py-3 bg-linear-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-lg text-white font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
                
                <a href='/register' className='text-sm text-gray-600 mt-4'>
                    Don't have an account? <span className='text-green-600 font-semibold cursor-pointer hover:underline'>Register</span>
                </a>
            </form>
        </div>
        </>
    )
}