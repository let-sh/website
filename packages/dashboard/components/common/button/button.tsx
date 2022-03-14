import * as React from 'react';
import cx from 'classnames';
import styles from './button.module.scss';

export declare type ButtonType =
  | 'default'
  | 'primary'
  | 'danger'
  | 'warning'
  | 'link';
export declare type ButtonShape = 'circle';
export declare type ButtonSize = 'small' | 'default' | 'large';
export interface ButtonProps extends React.HTMLAttributes<any> {
  autoFocus?: boolean;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  name?: string;
  value?: string | string[] | number;
  type?: ButtonType;
  icon?: string;
  shape?: ButtonShape;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  ghost?: boolean;
  block?: boolean;
}

export class Button extends React.Component<ButtonProps, {}> {
  static defaultProps = {
    type: 'default',
    size: 'default',
    loading: '',
    disabled: false,
    ghost: false,
    block: false,
  };

  getRootClassnames() {
    const { type, shape, size, disabled, ghost, block, className } = this.props;
    return cx(
      styles['btn'],
      styles[type && type !== 'default' ? `btn-${type}` : ''],
      styles[size && size !== 'default' ? `btn-${size}` : ''],
      styles[shape ? `btn-${shape}` : ''],
      styles[disabled ? 'btn-disabled' : ''],
      styles[ghost ? 'btn-ghost' : ''],
      styles[block ? 'btn-block' : ''],
      className
    );
  }

  render() {
    const {
      children,
      type,
      icon,
      shape,
      size,
      loading,
      disabled,
      ghost,
      block,
      ...otherProps
    } = this.props;
    return (
      <button
        {...otherProps}
        className={this.getRootClassnames()}
        disabled={disabled}
      >
        {/*{loading && !icon ? <Icon name="loading" /> : null}*/}
        {/*{icon ? <Icon name={icon} /> : null}*/}
        {children}
      </button>
    );
  }
}
