import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import DocsLayout from '../../components/DocsLayout';
import { getAllDocSlugs, getDocBySlug, getDocsTree, NavItem } from '../../lib/docs';

type DocPageProps = {
  docContent: {
    title: string;
    contentHtml: string;
  };
  navTree: NavItem[];
};

export default function DocPage({ docContent, navTree }: DocPageProps) {
  return (
    <DocsLayout navTree={navTree}>
      <Head>
        <title>{docContent.title}</title>
      </Head>
      <article className="prose lg:prose-xl max-w-none">
        <h1>{docContent.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: docContent.contentHtml }} />
      </article>
    </DocsLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllDocSlugs();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string[] | undefined;
  if (!slug) {
    return { notFound: true };
  }

  const docContent = await getDocBySlug(slug);
  const navTree = getDocsTree();

  return {
    props: {
      docContent,
      navTree,
    },
  };
};
