import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <Link href="/" className="text-lg font-bold">
          首页
        </Link>
        <div>
          <Link href="/news" className="mr-4">
            新闻
          </Link>
          <Link href="/weather">
            天气
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
