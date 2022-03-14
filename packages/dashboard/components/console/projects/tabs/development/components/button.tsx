import classNames from 'classnames';
import React, { ReactChildren } from 'react';
import styles from './button.module.scss';

interface ButtonProps {
  children: React.ReactChild;
  onClick: () => void;
  className?: string;
}

export function Button({ children, onClick, className }: ButtonProps) {
  return (
    <div className={classNames(className, styles['btn'])} onClick={onClick}>
      {children}
    </div>
  );
}
