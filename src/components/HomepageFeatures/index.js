import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '📚 Rich Documentation',
    description: (
      <>
        Comprehensive guides, tutorials, and documentation across multiple categories to help you master different topics and concepts.
      </>
    ),
  },
  {
    title: '🗺️ Easy Navigation',
    description: (
      <>
        Well-organized content with intuitive navigation, search functionality, and clear categorization to find what you need quickly.
      </>
    ),
  },
  {
    title: '🔄 Always Growing',
    description: (
      <>
        Continuously updated with new guides, tutorials, and documentation as we expand coverage across more categories and topics.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
