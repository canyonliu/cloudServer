import Head from 'next/head';
import type { FC } from 'react';
import { Input, Layout, Menu, Space } from 'antd';
import type { MenuProps } from 'antd';
import styles from '../styles/Home.module.css';

const { Header, Content } = Layout;
const { Search } = Input;

import Link from 'next/link';

const navItems: MenuProps['items'] = [
  { key: '1', label: <Link href="/news">新闻</Link> },
  { key: '2', label: '贴吧' },
  { key: '3', label: '知道' },
  { key: '4', label: '文库' },
  { key: '5', label: '图片' },
  { key: '6', label: '视频' },
  { key: '7', label: '地图' },
];

const onSearch = (value: string) => console.log(`Searching for: ${value}`);

const HomePage: FC = () => {
  return (
    <Layout className={styles.layout}>
      <Head>
        <title>首页</title>
        <meta name="description" content="A Next.js homepage clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header className={styles.header}>
        <Menu 
          theme="light" 
          mode="horizontal" 
          defaultSelectedKeys={['2']} 
          items={navItems} 
          style={{ lineHeight: '62px' }}
        />
      </Header>

      <Content className={styles.content}>
        <div className={styles.logo}>
          CANYON
        </div>
        <Space direction="vertical" size="large">
          <Search
            placeholder="请输入搜索内容"
            onSearch={onSearch}
            enterButton="搜索"
            size="large"
            className={styles.searchBox}
          />
        </Space>
      </Content>
    </Layout>
  );
}

export default HomePage;
