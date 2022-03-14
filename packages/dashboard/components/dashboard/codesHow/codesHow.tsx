import * as React from 'react';
import styles from './codesHow.module.scss';

function CodesHow() {
  return (
    <div className={styles['codeshow-container']}>
      <div className={styles['codeshow-dots']}>
        <div className={styles['codeshow-dot-1']}></div>
        <div className={styles['codeshow-dot-2']}></div>
        <div className={styles['codeshow-dot-3']}></div>
      </div>
      <pre>
        <span className={styles['codeshow-green']}>
          <strong>→ </strong>lets{' '}
        </span>
        <span className={styles['codeshow-black']}>deploy</span>
      </pre>
      <pre>
        &gt; Deploying{' '}
        <span className={styles['codeshow-black']}>~/project/scripts</span>{' '}
        under fred
      </pre>
      <pre>
        &gt; Using project{' '}
        <span className={styles['codeshow-black']}>scripts</span>
      </pre>
      <pre>&gt; https://scripts-dskdfh3wiu.let.sh [1s]</pre>
      <pre>
        <span className={styles['codeshow-grey']}>
          &gt; Ready! Deployment complete [6s]
        </span>
      </pre>
      <pre>
        -{' '}
        <span className={styles['codeshow-blue']}>https://scripts.let.sh</span>
      </pre>
    </div>
  );
}

export default CodesHow;
