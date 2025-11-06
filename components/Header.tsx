import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, loading, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-bold">
            首页
          </Link>
          <div className="ml-6">
            <Link href="/news" className="mr-4">
              新闻
            </Link>
            <Link href="/weather" className="mr-4">
              天气
            </Link>
            <Link href="/docs/getting-started/installation">
              Docs
            </Link>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="text-sm">Loading...</div>
          ) : user ? (
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
