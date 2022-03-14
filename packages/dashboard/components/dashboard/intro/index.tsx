import * as React from 'react';
// import ElementCircle from './elementCircle';
import WordsSlick from './WordsSlick';
import styles from './index.module.scss';
import NavLink from 'next/link';
import { IS_X5TBS } from '../../../utils/utils'
function Intro() {
  const wordsSlickStyle = {
    width: '180px',
    height: '64px',
    margin: '0 15px',
  };

  const svgMap: any = {
    oval: require('assets/img/oval.svg'),
    node: require('assets/img/node.svg'),
    react: require('assets/img/react.svg'),
    square: require('assets/img/square.svg'),
    trangle: require('assets/img/trangle.svg'),
    gatsby: require('assets/img/gatsby.svg'),
    golang: require('assets/img/golang.svg'),
    hugo: require('assets/img/hugo.svg'),
    vue: require('assets/img/vue.svg'),
    star: require('assets/img/star.svg'),
  };

  const decorationItems: any = [];
  Object.keys(svgMap).forEach((value) => {
    decorationItems.push(
      <div key={value} className={styles['intro-background-decorations-' + value]}>
        <img src={svgMap[value]} />
      </div>
    );
  });

  return (
    <div className={styles['intro-container']}>
      <div className={styles['intro-background']}>
        <div className={styles['intro-background-decorations']}>{decorationItems}</div>

        <div className={styles['intro-background-circle']}></div>
      </div>
      <div className={styles['intro-text-container']}>
        <div className={styles['intro-title']}>
          <div className={styles['intro-title-line1']}>
            lets
            <WordsSlick style={wordsSlickStyle} words={['deploy', 'create', 'host', 'dev', 'store']} />
            your
            <WordsSlick style={wordsSlickStyle} words={['app', 'site', 'api', 'service', 'data']} />
          </div>
          <div className={styles['intro-title-line2']}>with a single command line</div>
        </div>

        {typeof window !== 'undefined' && window.localStorage.getItem('token') ? (
            <div className={styles['intro-join-us']}>
              <NavLink href="/console">
                <div className={styles['intro-join-us-btn']}>
                    Visit Console
                </div>
              </NavLink>
            </div>
        ) : (
            <div className={styles['intro-join-us']}>
              <a href="https://let.sh/join" target="_blank">
                <div className={styles['intro-join-us-btn']}>
                  Join Us
                </div>
              </a>
            </div>

          )}
        <div className={styles['intro-code-preview']}>
          {/* <source src="https://assets.let.sh.cn/video/demo-vscode.mp4" type="video/mp4" /> */}
          {/* <img src="/img/vscode.png" alt="Picture of the author" /> */}
          <video poster={require('assets/img/vscode.png')} autoPlay loop muted x5-video-player-type={IS_X5TBS ? 'h5-page' : null}>
            <source src="https://assets.let.sh.cn/video/demo-vscode.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}

export default Intro;
