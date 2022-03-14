import React from 'react';

import SideBar from '../sideBar/sideBar';
import Article from '../article/article';

import styles from './document.module.scss';

interface Props {
  markdown: string;
}

class Document extends React.Component<Props> {
  render() {
    const markdown = this.props.markdown;

    return (
      <div className={styles['document-wrapper']}>
        <div className={styles['document-article']}>
          <Article source={markdown} />
        </div>
        <div className={styles['sidebar-wrapper']}>
          <div className={styles['sidebar']}>
            <SideBar source={markdown} ordered={false} declarative={true} />
          </div>
        </div>
      </div>
    );
  }
}

export default Document;
