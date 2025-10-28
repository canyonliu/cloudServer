import Head from 'next/head';
import { Input, Space } from 'antd';
import styles from '../styles/Home.module.css';

const { Search } = Input;

const onSearch = (value) => console.log(`Searching for: ${value}`);

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>首页</title>
        <meta name="description" content="A Next.js homepage clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.logo}>
          Canyon
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
      </main>
    </div>
  );
}
