import React from 'react';
import cls from 'classnames';
import styles from './index.module.scss';

interface ScoreItemProps {
  type: string;
  score: string | number;
  raw?: number;
}

function getColor(value: number, range: [number, number], asc = true) {
  if (asc) {
    if (value < range[0]) {
      return 'red';
    } else if (value < range[1]) {
      return 'orange';
    } else {
      return 'green';
    }
  } else {
    if (value > range[0]) {
      return 'red';
    } else if (value > range[1]) {
      return 'orange';
    } else {
      return 'green';
    }
  }
}

const percent = ['Performance', 'Accessibility', 'Best Practice'];

function ScoreItem({ type, score, raw }: ScoreItemProps) {
  let extraCls = '';

  if (percent.includes(type)) {
    extraCls = getColor(+score, [50, 90]);
  }

  if (type === 'Total Blocking Time' && raw) {
    extraCls = getColor(raw, [350, 150], false);
  }

  if (type === 'Cumulative Layout Shift' && raw) {
    extraCls = getColor(raw, [0.25, 0.1], false);
  }

  if (type === 'Largest Contentful Paint' && raw) {
    extraCls = getColor(raw, [2400, 1200], false);
  }

  return (
    <div className={cls(styles['score-container'], styles[extraCls])}>
      <div className="w-4 h-4 flex justify-center items-center">
        <span className={styles['score-check-item']} />
      </div>
      <div className={styles['score-text']}>{type}</div>
      <div className={styles['score-number']}>{score}</div>
    </div>
  );
}

export default ScoreItem;
