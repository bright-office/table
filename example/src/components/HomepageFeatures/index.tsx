import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    description: (
      <>
        Bright table was designed from the ground up to be easily installed and
        used to get your table up and running quickly.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    description: (
      <>
        Bright table lets you focus on your website, and we&apos;ll do the chores. Go
        ahead and install bright table by cloning our repository.
      </>
    ),
  },
  {
    title: 'Powered by React',
    description: (
      <>
        Extend or customize your website table by reusing React. Bright table can
        be extended and used in variuous ways.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}


