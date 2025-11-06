import Link from 'next/link';
import { NavItem } from '../lib/docs';
import { useRouter } from 'next/router';

type SidebarProps = {
  tree: NavItem[];
};

const SidebarNode = ({ node }: { node: NavItem }) => {
  const router = useRouter();
  const isActive = node.path && router.asPath === node.path;

  return (
    <li className="mb-2">
      {node.path ? (
        <Link href={node.path} className={`block rounded-md px-3 py-2 text-base font-medium ${
            isActive
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}>

          {node.name}

        </Link>
      ) : (
        <span className="font-semibold text-gray-800">{node.name}</span>
      )}
      {node.children && (
        <ul className="pl-4 mt-2 border-l border-gray-200">
          {node.children.map((child) => (
            <SidebarNode key={child.name} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar = ({ tree }: SidebarProps) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-50 p-4 border-r">
      <nav>
        <ul>
          {tree.map((node) => (
            <SidebarNode key={node.name} node={node} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
