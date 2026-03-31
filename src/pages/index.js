import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">Your comprehensive knowledge base for tutorials, guides, and best practices</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            style={{backgroundColor: '#00ccff', borderColor: '#00ccff'}}
            to="/docs-as-code/docs/tutorial-basics/congratulations">
            Explore Tutorials 📚
          </Link>
          <Link
            className="button button--lg"
            style={{backgroundColor: 'transparent', borderColor: 'white', color: 'white'}}
            to="/docs-as-code/docs/deployment/github-pages-deployment-guide">
            Browse Guides 🔍
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Documentation`}
      description="Complete documentation covering tutorials, guides, deployment instructions, and best practices across multiple categories">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
