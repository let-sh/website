import React from 'react';
import styles from './sideBar.module.scss';

interface Props {
  source: string;
  ordered?: boolean;
  headingTopOffset?: number;
  updateHashAuto?: boolean;
  declarative?: boolean;
  className?: string;
  onNavItemClick?: any;
  onHashChange?: any;
}

interface States {
  currentListNo: any;
}

export class SideBar extends React.Component<Props, States> {
  $addTargetTimeout: any;
  $scrollEventLockTimer: any;
  $scrollEventLock: any;
  $scrollTimeout: any;

  static defaultProps: Partial<Props> = {
    source: '',
    ordered: true,
    headingTopOffset: 0,
    updateHashAuto: true,
    declarative: false,
    className: '',
    onNavItemClick: () => {
      // do nothing.
    },
    onHashChange: () => {
      // do nothing.
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentListNo: '',
    };
  }

  componentDidMount() {
    if (this.$addTargetTimeout) {
      clearTimeout(this.$addTargetTimeout);
    }
    this.$addTargetTimeout = setTimeout(() => {
      this.initHeadingsId();
      document.addEventListener('scroll', this.winScroll, false);
      window.addEventListener('hashchange', this.winHashChange, false);
    }, 500);
  }

  shouldComponentUpdate(nextProps: any) {
    if (nextProps.source !== this.props.source) {
      if (this.$scrollEventLockTimer) {
        clearTimeout(this.$scrollEventLockTimer);
      }
      this.$scrollEventLock = true;

      window.scrollTo(0, 0);
      this.setState({
        currentListNo: '',
      });
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      Array.prototype.slice.apply(headings).forEach((h) => (h.dataset.id = ''));

      this.$scrollEventLockTimer = setTimeout(() => {
        this.initHeadingsId();
        this.$scrollEventLock = false;
      }, 500);
    }
    return true;
  }

  componentWillUnmount() {
    if (this.$addTargetTimeout) {
      clearTimeout(this.$addTargetTimeout);
    }
    if (this.$scrollTimeout) {
      clearTimeout(this.$scrollTimeout);
    }
    document.removeEventListener('scroll', this.winScroll, false);
    window.removeEventListener('hashchange', this.winHashChange, false);
  }

  getNavStructure() {
    const contentWithoutCode = this.props.source
      .replace(/^[^#]+\n/g, '')
      .replace(/^#\s[^#\n]*\n+/, '')
      .replace(/```[^`\n]*\n+[^```]+```\n+/g, '')
      .replace(/`([^`\n]+)`/g, '$1')
      .replace(/\*\*?([^*\n]+)\*\*?/g, '$1')
      .replace(/__?([^_\n]+)__?/g, '$1')
      .trim();

    const pattOfTitle = /#+\s([^#\n]+)\n*/g;
    const matchResult = contentWithoutCode.match(pattOfTitle);
    if (!matchResult) {
      return [];
    }

    const navData: any = matchResult.map((r: any, i: any) => ({
      index: i,
      level: r.match(/^#+/g)[0].length,
      text: r.replace(pattOfTitle, '$1'),
    }));

    const levelCount = (level: any) =>
      navData.filter((r: { level: any }) => r.level === level).length;
    let startLevel = 1;
    let startLevelCount = levelCount(startLevel);
    while (!startLevelCount) {
      startLevel += 1;
      startLevelCount = levelCount(startLevel);
    }

    let listNo = 1;
    navData.forEach((t: any) => {
      if (t.level === startLevel) {
        t.listNo = listNo.toString();
        listNo += 1;
      }
    });

    navData.forEach((t: any, i: any) => {
      if (!t.listNo) {
        if (navData[i - 1] && t.level === navData[i - 1].level + 1) {
          t.listNo = `${navData[i - 1].listNo}.1`;
        } else if (navData[i - 1] && t.level === navData[i - 1].level) {
          t.listNo = navData[i - 1].listNo.replace(
            /^(.+\.)(\d+)$/g,
            (w: any, $1: any, $2: string) => `${$1}${parseInt($2, 10) + 1}`
          );
        } else {
          t.listNo = '';
        }
      }
    });

    const result = navData.map((nav: { listNo: any; text: any }) => ({
      ...nav,
      listNo: nav.listNo.indexOf('.') < 0 ? `${nav.listNo}.` : nav.listNo,
      text: nav.text,
    }));

    return result;
  }

  scrollToTarget(dataId: any) {
    if (this.$scrollTimeout) {
      clearTimeout(this.$scrollTimeout);
    }

    this.$scrollTimeout = setTimeout(() => {
      const target: any = document.querySelector(`[data-id="${dataId}"]`);
      if (target && typeof target.offsetTop === 'number') {
        window.scrollTo(0, target.offsetTop - this.props.headingTopOffset!);
      }
    }, 0);
  }

  initHeadingsId() {
    const headingId = decodeURIComponent(
      this.props.declarative
        ? window.location.hash.replace(/^#/, '').trim()
        : (window.location.hash.match(/heading-\d+/g) || [])[0]
    );

    this.getNavStructure().forEach(
      (t: { level: any; text: any; index: any; listNo: any }) => {
        const headings = document.querySelectorAll(`h${t.level}`);
        const curHeading = Array.prototype.slice
          .apply(headings)
          .find((h) => h.innerText === t.text && (!h.dataset || !h.dataset.id));

        if (curHeading) {
          curHeading.dataset.id = this.props.declarative
            ? t.text
            : `heading-${t.index}`;

          if (headingId && headingId === curHeading.dataset.id) {
            this.scrollToTarget(headingId);
            this.setState({
              currentListNo: t.listNo,
            });
          }
        }
      }
    );
  }

  getHeadingList() {
    const headingList: any = [];

    this.getNavStructure().forEach(
      (t: { level: any; text: any; index: any; listNo: any }) => {
        const headings = document.querySelectorAll(`h${t.level}`);
        const curHeading = Array.prototype.slice
          .apply(headings)
          .find(
            (h) =>
              h.innerText === t.text &&
              !headingList.find(
                (x: { offsetTop: any }) => x.offsetTop === h.offsetTop
              )
          );
        if (curHeading) {
          headingList.push({
            dataId: this.props.declarative ? t.text : `heading-${t.index}`,
            listNo: t.listNo,
            offsetTop: curHeading.offsetTop,
          });
        }
      }
    );

    return headingList;
  }

  getCurrentHashValue = () =>
    decodeURIComponent(window.location.hash.replace(/^#/, ''));

  winScroll = () => {
    if (this.$scrollEventLock) return;

    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const newHeadingList = this.getHeadingList().map((h: any) => ({
      ...h,
      distanceToTop: Math.abs(
        scrollTop + this.props.headingTopOffset! - h.offsetTop
      ),
    }));
    const distanceList = newHeadingList.map(
      (h: { distanceToTop: any }) => h.distanceToTop
    );
    const minDistance = Math.min(...distanceList);
    const curHeading = newHeadingList.find(
      (h: { distanceToTop: number }) => h.distanceToTop === minDistance
    );

    if (this.props.updateHashAuto) {
      // Hash changing callback
      if (curHeading.dataId !== this.getCurrentHashValue()) {
        this.props.onHashChange(curHeading.dataId, this.getCurrentHashValue());
      }

      this.updateHash(curHeading.dataId);
    }
    this.setState({
      currentListNo: curHeading.listNo,
    });
  };

  winHashChange = () => {
    this.scrollToTarget(this.getCurrentHashValue());
  };

  updateHash(value: any) {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${window.location.search}#${value}`
    );
  }

  render() {
    const tBlocks = this.getNavStructure().map(
      (t: {
        level: any;
        listNo: {} | null | undefined;
        text: React.ReactNode;
        index: any;
      }) => {
        const cls = `${styles['title-anchor']} ${
          styles[`title-level${t.level}`]
        } ${this.state.currentListNo === t.listNo ? styles['active'] : ''}`;

        return (
          <div
            className={cls}
            onClick={(evt) => {
              const currentHash = this.props.declarative
                ? t.text
                : `heading-${t.index}`;

              // Avoid execution the callback `onHashChange` when clicking current nav item
              if (t.listNo !== this.state.currentListNo) {
                // Hash changing callback
                this.props.onHashChange(
                  currentHash,
                  this.getCurrentHashValue()
                );
              }

              // Nav item clicking callback
              this.props.onNavItemClick(evt, evt.target, currentHash);

              this.updateHash(currentHash);
              this.scrollToTarget(currentHash);
              this.setState({
                currentListNo: t.listNo,
              });
            }}
            key={`title_anchor_${Math.random().toString(36).substring(2)}`}
          >
            {this.props.ordered ? <small>{t.listNo}</small> : null}
            {t.text}
          </div>
        );
      }
    );

    return (
      <div className={`markdown-navigation ${this.props.className}`}>
        {tBlocks}
      </div>
    );
  }
}

export default SideBar;
