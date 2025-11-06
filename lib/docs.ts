import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const docsDirectory = path.join(process.cwd(), 'docs');

export interface NavItem {
  name: string;
  path?: string;
  children?: NavItem[];
}

// Recursively builds the navigation tree
function buildTree(directory: string, basePath: string = '/docs'): NavItem[] {
  const items = fs.readdirSync(directory, { withFileTypes: true });
  const navItems: NavItem[] = [];

  for (const item of items) {
    const fullPath = path.join(directory, item.name);
    const relativePath = path.join(basePath, item.name.replace(/\.md$/, ''));

    if (item.isDirectory()) {
      navItems.push({
        name: formatName(item.name),
        children: buildTree(fullPath, relativePath),
      });
    } else if (item.isFile() && item.name.endsWith('.md')) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      navItems.push({
        name: matterResult.data.title || formatName(item.name),
        path: relativePath,
      });
    }
  }
  return navItems;
}

function formatName(name: string) {
  return name
    .replace(/\.md$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getDocsTree(): NavItem[] {
  return buildTree(docsDirectory);
}

// Gets all possible URL slugs for getStaticPaths
export function getAllDocSlugs(tree: NavItem[] = getDocsTree(), parentSlug: string[] = []): { params: { slug: string[] } }[] {
  let paths: { params: { slug: string[] } }[] = [];
  for (const item of tree) {
    if (item.path) {
      // The path is like /docs/getting-started/installation, so we split and drop the first two parts
      const slug = item.path.split('/').slice(2);
      paths.push({ params: { slug } });
    }
    if (item.children) {
      paths = paths.concat(getAllDocSlugs(item.children));
    }
  }
  return paths;
}

// Gets the content for a specific page
export async function getDocBySlug(slug: string[]) {
  const filePath = path.join(docsDirectory, `${slug.join('/')}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    contentHtml,
    title: matterResult.data.title || formatName(slug[slug.length - 1]),
  };
}
