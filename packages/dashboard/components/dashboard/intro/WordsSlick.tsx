import * as React from 'react';
import Slick from 'react-slick';
import classnames from 'classnames';
import 'slick-carousel/slick/slick.css';
import styles from './WordsSlick.module.scss';

interface WordsSlickProps {
  className?: string;
  words: string[];
  style?: object;
}

function WordsSlick({ className, words, style }: WordsSlickProps) {
  const settings = {
    dots: false,
    vertical: true,
    autoplay: true,
    arrows: false,
    infinite: true,
    autoplaySpeed: 1000,
  };

  return (
    <div
      className={classnames(
        styles['wordsslick-font'],
        styles['wordsslick-container'],
        className
      )}
      style={style}
    >
      <Slick {...settings}>
        {words.map((word) => (
          <p key={word}>{word}</p>
        ))}
      </Slick>
    </div>
  );
}

export default WordsSlick;
