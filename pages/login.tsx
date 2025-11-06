import { useState, FormEvent, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await login(email, password);

    if (response.ok) {
      const redirectPath = router.query.redirect as string | undefined;
      router.push(redirectPath || '/');
    } else {
      const data = await response.json();
      setError(data.error || 'Something went wrong.');
    }
  };

  const handleSkipLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);

    const response = await login('admin@example.com', 'password123');

    if (response.ok) {
      const redirectPath = router.query.redirect as string | undefined;
      router.push(redirectPath || '/');
    } else {
      setError('Could not perform the skip login. Please check the mock user credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign In
            </button>
            <button
              onClick={handleSkipLogin}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Skip Login (for development)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
