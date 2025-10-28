import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Layout, Row, Col, Card, Pagination, Alert, Empty } from 'antd';
import styles from '../styles/News.module.css';

const { Content } = Layout;
const { Meta } = Card;

interface Article {
  title: string;
  description: string;
  url: string;
  picUrl: string;
}

interface NewsPageProps {
  articles: Article[];
  total: number;
  currentPage: number;
  error?: string;
}

const NewsPage: NextPage<NewsPageProps> = ({ articles, total, currentPage, error }) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/news?page=${page}`);
  };

  if (error) {
    return <Alert message="错误" description={error} type="error" showIcon style={{ margin: '20px' }} />;
  }

  return (
    <Layout>
      <Head>
        <title>足球新闻</title>
      </Head>
      <Content>
        <div className={styles.container}>
          {articles.length > 0 ? (
            <>
              <Row gutter={[16, 24]}>
                {articles.map((article, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={index}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <Card
                        hoverable
                        cover={<img alt={article.title} src={article.picUrl || 'https://via.placeholder.com/400x250?text=No+Image'} className={styles.cardImage} />}
                      >
                        <Meta
                          title={article.title}
                          description={article.description}
                          className={styles.cardMeta}
                        />
                      </Card>
                    </a>
                  </Col>
                ))}
              </Row>
              <div className={styles.pagination}>
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={20}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <Empty description="暂无新闻数据" />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = context.query.page || '1';
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return {
      props: {
        articles: [], total: 0, currentPage: 1,
        error: '未在服务器上配置NEWS_API_KEY环境变量。'
      },
    };
  }

  try {
    const res = await fetch(`https://apis.tianapi.com/football/index?key=${apiKey}&num=20&page=${page}`);
    const data = await res.json();

    if (data.code !== 200) {
      throw new Error(data.msg);
    }

    return {
      props: {
        articles: data.result.newslist,
        total: data.result.total || 500, // Tianapi free tier doesn't provide total, so we fake it for pagination UI
        currentPage: parseInt(page as string, 10),
      },
    };
  } catch (err: any) {
    return {
      props: {
        articles: [], total: 0, currentPage: 1,
        error: `获取新闻失败: ${err.message}`
      },
    };
  }
};

export default NewsPage;
