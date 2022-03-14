import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '../codeBlock/codeBlock';

import styles from './article.module.scss';

interface Props {
  source: string;
}

class Article extends Component<Props> {
  render() {
    const { source } = this.props;
    return (
      <div className={styles['article-wrapper']}>
        <ReactMarkdown
          source={source}
          className={styles['mark']}
          renderers={{ code: CodeBlock }}
        />
      </div>
    );
  }
}

export default Article;
