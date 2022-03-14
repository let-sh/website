import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { Popover, Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import cls from 'classnames';
import styles from './index.module.scss';
import InfiniteScroll from 'react-infinite-scroller';
import { useDomainsService, DomainsNode, DomainsItem } from 'service/useDomainsService';
import { useMutation, gql } from '@apollo/client';

function Domains() {
  const [afterCursor, setAfterCursor] = useState<number>();
  const [list, setList] = useState<DomainsNode[]>([]);
  const { loading, data, getDomains, pageInfo, totalCount } = useDomainsService({});
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [setDomain, { loading: addLoading, data: domainData }] = useMutation<{
    addDomain: DomainsItem;
  }>(
    gql`
      mutation addDomain($hostname: String!) {
        addDomain(hostname: $hostname) {
          id
          subdomain
          domain
          cn
          certificateStatus
        }
      }
    `,
    {
      onCompleted: () => {
        setModalVisible(false);
      },
    }
  );

  useEffect(() => {
    if (data.length > 0) {
      setList([...list, ...data]);
    }
  }, [data]);

  useEffect(() => {
    getDomains({
      variables: {
        after: afterCursor,
      },
    });
  }, [afterCursor]);

  useEffect(() => {
    if (domainData) {
      setList([{ node: domainData.addDomain }, ...list]);
    }
  }, [domainData]);

  const handleInfiniteOnLoad = useCallback(() => {
    if (list.length > totalCount) {
      return;
    }
    setAfterCursor(pageInfo.endCursor);
  }, [pageInfo.endCursor, totalCount]);

  return (
    <div className={styles['domains-container']}>
      <Head>
        <title> Domains - let.sh</title>
        <meta name="description" content="Domains Console" />
      </Head>
      <div className="flex items-center mb-10">
        <span className={styles['domains-header']}>Domains</span>
        <div
          onClick={() => setModalVisible(true)}
          style={{ fontSize: 16 }}
          className={cls(styles['domains-add-btn'], 'text-white cursor-pointer')}
        >
          Add
        </div>
        <Modal
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
          }}
          closable={false}
          className={styles['add-modal']}
          centered
          footer={null}
          modalRender={() => (
            <div className="relative pointer-events-auto">
              <p className="text-2xl font-bold">Add Domain</p>
              <p className="mb-4 text-xl mt-9">domain</p>
              <input
                style={{ border: 'solid 2px rgba(0, 0, 0, 0.1)' }}
                className="w-full px-4 py-3 mb-24 text-xl outline-none rounded-xl"
                placeholder="e.g.let.sh"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
              />
              <div
                className={cls(
                  'font-bold text-base text-center cursor-pointer text-white border-0 absolute right-0 bottom-0',
                  styles['modal-submit-btn']
                )}
                onClick={() => {
                  if (!inputValue) {
                    return;
                  }
                  setDomain({
                    variables: {
                      hostname: inputValue,
                    },
                  });
                }}
              >
                {addLoading ? (
                  <Spin
                    indicator={<LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />}
                  />
                ) : (
                  'Submit'
                )}
              </div>
            </div>
          )}
        ></Modal>
      </div>
      <div className={styles['domains-card-container']}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={handleInfiniteOnLoad}
          hasMore={!loading && pageInfo.hasNextPage}
          useWindow={false}
        >
          <div className={cls('flex justify-between py-3', styles['domains-list-item'])}>
            <div className="flex items-center">
              <span className={cls('font-bold', styles['domain'])}>domain</span>
              <span className="inline-block w-24 font-bold text-center">status</span>
            </div>
            <span className="w-24 font-bold">created</span>
          </div>
          {list.map(({ node }) => {
            return (
              <div
                key={node.id}
                className={cls('flex justify-between py-5', styles['domains-list-item'])}
              >
                <div className="flex items-center">
                  <span className={styles['domain']}>{node.domain}</span>
                  {node.certificateStatus !== 'to_be_verified' ? (
                    <span
                      style={{ fontSize: 12, color: '#00c083' }}
                      className={cls(
                        'w-20 inline-block font-bold py-0.5',
                        styles['domains-status-success']
                      )}
                    >
                      Running
                    </span>
                  ) : (
                    <Popover
                      content={() => (
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: 20 }}>Check dns config</div>
                          <p style={{ fontSize: 16, marginTop: 7, marginBottom: 14 }}>
                            Please set the following record on your DNS provider:
                          </p>
                          <div style={{ fontSize: 14 }} className={styles['dns-config']}>
                            <div className={styles['dns-config-title']}>
                              <span>Type</span>
                              <span>Name</span>
                              <span>Value</span>
                            </div>
                            <div className={styles['dns-config-detail']}>
                              <span>CNAME</span>
                              <span>@</span>
                              <span>global.oasis.name</span>
                            </div>
                          </div>
                          <p style={{ color: 'rgba(0, 0, 0, 0.3)', fontSize: 14 }}>
                            next validation plan: 16:20{' '}
                          </p>
                        </div>
                      )}
                    >
                      <span
                        style={{ fontSize: 12 }}
                        className={cls(
                          'w-24 inline-block font-bold py-0.5 cursor-pointer',
                          styles['domains-status-verified']
                        )}
                      >
                        To Be Verify
                      </span>
                    </Popover>
                  )}
                </div>
                <span style={{ fontSize: 18 }} className="w-24">
                  { dayjs(node.createdAt).fromNow() }
                </span>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Domains;
