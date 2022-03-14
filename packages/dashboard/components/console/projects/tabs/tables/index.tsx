import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
import { Table } from 'antd';
import useTableList from 'service/tables/useTableList';
import dayjs from 'dayjs';
import useTableItems from 'service/tables/useTableItems';

const { Column, ColumnGroup } = Table;

interface TablesProps {
  projectID: string;
}

function Tables({ projectID }: TablesProps) {
  const [env, setEnv] = useState('prod');
  const [unwrapped, setUnwrapped] = useState(false);
  const [tableName, setTableName] = useState('');

  const { getTableList, tableList, loading } = useTableList();
  const { getTableItems, tableItems } = useTableItems();

  console.log(tableItems);

  useEffect(() => {
    getTableList({
      variables: {
        projectID: projectID,
      },
    });
  }, []);

  useEffect(() => {
    if (tableName) {
      getTableItems({
        variables: {
          projectID,
          tableName,
        },
      });
    }
  }, [tableName]);

  let dataSource: any[] = [];
  let keys = [];
  let titles = new Set<string>();

  tableItems.forEach(({ key, value }) => {
    keys.push(key);
    let parsedJson = JSON.parse(value);
    let items = Object.keys(parsedJson);
    items.forEach((item) => {
      titles.add(item);
    });
    items.forEach((item) => {
      dataSource.push({
        key,
        [item]: parsedJson[item],
      });
    });
  });

  return (
    <div>
      <div className="flex justify-between relative items-center">
        <div
          onClick={() => setUnwrapped(!unwrapped)}
          className={classNames(styles['tables-container'])}
        >
          <div className={styles['tables-name']}>tables</div>
        </div>
        <div
          className={classNames(
            styles['tables-container'],
            {
              [styles['unwrapped']]: unwrapped,
            },
            styles['drop-down']
          )}
        >
          <div onClick={() => setUnwrapped(!unwrapped)} className={styles['tables-name']}>
            tables
          </div>
          {unwrapped && (
            <div
              style={{
                marginTop: 10,
              }}
            >
              {tableList.map(({ name, createdAt }) => {
                return (
                  <div
                    onClick={() => {
                      setTableName(name);
                      setUnwrapped(!unwrapped);
                    }}
                    className={styles['tables-name-item']}
                    key={name}
                  >
                    <span>{name}</span>
                    <span>{dayjs(createdAt).fromNow()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className={styles['simple-switch']}>
          <span
            className={classNames({
              [styles['active']]: env === 'prod',
            })}
            onClick={() => {
              setEnv('prod');
            }}
          >
            Prod
          </span>
          <span
            className={classNames({
              [styles['active']]: env === 'dev',
            })}
            onClick={() => {
              setEnv('dev');
            }}
          >
            Dev
          </span>
        </div>
      </div>
      <div className={styles['table-list']}>
        <Table dataSource={dataSource}>
          <Column title="Id" dataIndex="key" key="key" />
          {[...titles].map((title) => (
            <Column title={title} dataIndex={title} key={title} />
          ))}
        </Table>
      </div>
    </div>
  );
}

export default Tables;
