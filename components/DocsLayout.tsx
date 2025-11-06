import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { NavItem } from '../lib/docs';

type DocsLayoutProps = {
  children: ReactNode;
  navTree: NavItem[];
};

const DocsLayout = ({ children, navTree }: DocsLayoutProps) => {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar tree={navTree} />
      <main className="flex-grow p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DocsLayout;
