import { DownOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './index.module.scss';

export interface DropdownSelectorProps {
  list: any[];
  optionsTitle?: string;
  onClick: (e: string) => void;
  placeholder?: string;
  defaultSeleted?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

function DropdownSelector({
  list,
  optionsTitle,
  onClick,
  placeholder,
  defaultSeleted,
  hasMore = false,
  onLoadMore = () => {},
}: DropdownSelectorProps) {
  const [unwrapped, setUnwrapped] = useState(false);
  const [selected, setSelected] = useState(defaultSeleted || placeholder || 'selected');

  return (
    <div>
      <div
        onClick={() => setUnwrapped(!unwrapped)}
        className={classNames(styles['selector-container'])}
      >
        <div className={styles['selector-main']}>
          {selected}
          <DownOutlined
            style={{
              position: 'absolute',
              right: 0,
              fontWeight: 'bold',
            }}
          />
        </div>
      </div>
      {unwrapped && (
        <div className={classNames(styles['selector-options'])} id="inifinite-selector-scroll">
          <div className={styles['selector-options-title']}>{optionsTitle}</div>
          <InfiniteScroll
            hasMore={hasMore}
            next={() => {
              onLoadMore();
            }}
            dataLength={list.length}
            loader={null}
            scrollableTarget="inifinite-selector-scroll"
          >
            {list.map((listItem) => {
              return (
                <div
                  onClick={() => {
                    setUnwrapped(!unwrapped);
                    setSelected(listItem.name);
                    onClick(listItem.value);
                  }}
                  className={styles['selector-options-item']}
                  key={listItem.key}
                >
                  {listItem.name}
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}

export default DropdownSelector;
