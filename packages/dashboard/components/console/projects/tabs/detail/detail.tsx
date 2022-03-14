import React, { useEffect, useReducer } from 'react';
import { Empty } from 'antd';
import ScoreItem from './ScoreItem';
import Skeleton from './skeleton';
import {
  Score,
  Runtime,
  DeploymentsItem,
  useSingleDeploymentDetailsService,
} from 'service/useDeploymentDetails';
import styles from './detail.module.scss';
import DropdownSelector from 'components/common/DropdownSelector';
import { PageInfo, GraphqlNode } from 'interfaces';
interface Props {
  deploymentDetails: DeploymentsItem | null;
  detailsLoading: boolean;
  deployments: GraphqlNode<DeploymentsItem>[];
  hasNext: boolean;
  fetchMore: () => void;
}

function toFixed(num: number, n: number) {
  if (n <= 0) {
    return num.toFixed(0);
  } else {
    const a = num.toString().split('.')[1];

    if (a) {
      if (a.length <= n) {
        return num;
      } else {
        const res = num.toFixed(n);
        return res;
      }
    } else {
      return num;
    }
  }
}

const format = (time: number) => {
  if (time > 1000) {
    return `${toFixed(time / 1000, 1)}s`;
  }
  return `${time.toFixed(0)}ms`;
};

interface State {
  score: Score | null;
  runtime: Runtime | null;
  deploymentDetails: DeploymentsItem | null;
}

const reducer: (
  state: State,
  action: {
    type: string;
    payload: any;
  }
) => State = (
  state: State,
  action: {
    type: string;
    payload: any;
  }
) => {
  switch (action.type) {
    case 'change': {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

function Detail({
  deploymentDetails: initDeploymentDetails,
  deployments,
  hasNext,
  fetchMore,
  detailsLoading,
}: Props) {
  let selectorList = deployments.map((item) => {
    return {
      key: item.node.id,
      name: `V${item.node.version}`,
      value: item.node.id,
    };
  });

  let [detailState, detailStateDispatch] = useReducer(reducer, {
    score: null,
    runtime: null,
    deploymentDetails: initDeploymentDetails,
  });

  const { getDeploymentDetails, loading } = useSingleDeploymentDetailsService((data) => {
    detailStateDispatch({
      type: 'change',
      payload: {
        score: data.deployment.score,
        runtime: data.deployment.runtime,
        deploymentDetails: data.deployment,
      },
    });
  });

  useEffect(() => {
    if (initDeploymentDetails) {
      getDeploymentDetails({
        variables: {
          id: initDeploymentDetails?.id,
        },
      });
    }
  }, [initDeploymentDetails]);

  const { score, runtime, deploymentDetails } = detailState;

  const isLoading =
    loading || detailsLoading || (deploymentDetails === null && initDeploymentDetails != null);

  return (
    <>
      {!detailsLoading && initDeploymentDetails != null && (
        <DropdownSelector
          // placeholder="Deployments"
          defaultSeleted={`V${initDeploymentDetails?.version}`}
          list={selectorList}
          hasMore={hasNext}
          onLoadMore={fetchMore}
          onClick={(id) => {
            getDeploymentDetails({
              variables: {
                id,
              },
            });
          }}
        />
      )}
      <div className={styles['detail-wrapper']}>
        <p className={styles['detail-item-title']}>Deployment</p>
        {isLoading ? (
          <Skeleton />
        ) : deploymentDetails === null ? (
          <Empty />
        ) : (
          <>
            <div className={styles['detail-item-container']}>
              <div className={styles['detail-item-col']}>
                <div className={styles['detail-item-label']}>
                  <div className="relative">
                    Version
                    <div className="inline right-0 absolute text-gray-500 font-normal">
                      {deploymentDetails.version}
                    </div>
                  </div>
                  <div className="relative">
                    Status
                    <div className="inline right-0 absolute">
                      <div
                        className={`${styles['item-status']} ${
                          styles[deploymentDetails.status.toLowerCase()]
                        }`}
                      >
                        {deploymentDetails.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles['vertical-line']} />
              <div className={styles['detail-item-col']}>
                <div className={styles['detail-item-label']}>
                  <div className="relative">
                    Channel{' '}
                    <div className="inline right-0 absolute text-gray-500 font-normal">
                      <div
                        className={`${styles['env-tag']} ${
                          styles[deploymentDetails.channel.toLowerCase()]
                        }`}
                      >
                        {deploymentDetails.channel.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  {deploymentDetails.cn === true && (
                    <div className="relative">
                      CN{' '}
                      <div className="inline right-0 absolute text-gray-500 font-normal">
                        {JSON.stringify(deploymentDetails.cn)}
                      </div>
                    </div>
                  )}
                </div>
                {/* <ScoreItem
                    type="Largest Contentful Paint"
                    score={format(score.largestContentfulPaint)}
                    raw={score.largestContentfulPaint}
                  /> */}
              </div>
            </div>
          </>
        )}
      </div>

      {runtime && (
        <div className={styles['detail-wrapper']}>
          <p className={styles['detail-item-title']}>Functions</p>
          {isLoading ? (
            <Skeleton />
          ) : runtime === null ? (
            <Empty />
          ) : (
            <>
              <div className={styles['detail-item-container']}>
                <div className={styles['detail-item-col']}>
                  <div className={styles['detail-item-label']}>
                    <div className="relative">
                      RAM
                      <div className="inline right-0 absolute text-gray-500 font-normal">
                        {runtime.ram} M
                      </div>
                    </div>
                  </div>
                  {/* <ScoreItem type="Performance" score={Math.round(score.performance * 100)} /> */}
                </div>
                <div className={styles['vertical-line']} />
                <div className={styles['detail-item-col']}>
                  <div className={styles['detail-item-label']}>
                    <div className="relative">
                      Region{' '}
                      <div className="inline right-0 absolute text-gray-500 font-normal">
                        {runtime.region}
                      </div>
                    </div>
                  </div>
                  {/* <ScoreItem
                  type="Largest Contentful Paint"
                  score={format(score.largestContentfulPaint)}
                  raw={score.largestContentfulPaint}
                /> */}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <div className={styles['detail-wrapper']}>
        <p className={styles['detail-item-title']}>Lighthouse</p>
        {isLoading ? (
          <Skeleton />
        ) : score === null ? (
          <Empty />
        ) : (
          <>
            <div className={styles['detail-item-container']}>
              <div className={styles['detail-item-col']}>
                <ScoreItem type="Performance" score={Math.round(score.performance * 100)} />
                <ScoreItem type="Accessibility" score={score.accessibility * 100} />
                <ScoreItem type="Best Practice" score={score.bestPractice * 100} />
              </div>
              <div className={styles['vertical-line']} />
              <div className={styles['detail-item-col']}>
                <ScoreItem
                  type="Largest Contentful Paint"
                  score={format(score.largestContentfulPaint)}
                  raw={score.largestContentfulPaint}
                />
                <ScoreItem
                  type="Cumulative Layout Shift"
                  score={`${toFixed(score.cumulativeLayoutShift, 3)}`}
                  raw={score.cumulativeLayoutShift}
                />
                <ScoreItem
                  type="Total Blocking Time"
                  score={`${format(score.totalBlockingTime)}`}
                  raw={score.totalBlockingTime}
                />
              </div>
            </div>
            <p className={styles['detail-lighthouse-url']}>
              Full Report:{' '}
              <a
                style={{ cursor: 'pointer' }}
                target="_blank"
                rel="noopener noreferrer"
                href={score.fullReport}
              >
                https://report.let.sh
              </a>
            </p>
          </>
        )}
      </div>
      <div className={styles['detail-wrapper']} style={{ display: 'none' }}>
        <p className={styles['detail-item-title']}>Functions</p>
        <div className={styles['detail-item-container']}>
          <div className={styles['detail-item-col']}>
            <div className={styles['detail-function-item']}>
              <span className={styles['detail-function-name']}>Region</span>
              <span className={styles['detail-function-value']}>hongkong</span>
            </div>
            <div className={styles['detail-function-item']}>
              <span className={styles['detail-function-name']}>Region</span>
              <span className={styles['detail-function-value']}>hongkong</span>
            </div>
          </div>
          <div className={styles['vertical-line']} />
          <div className={styles['detail-item-col']}>
            <div className={styles['detail-function-item']}>
              <span className={styles['detail-function-name']}>Region</span>
              <span className={styles['detail-function-value']}>hongkong</span>
            </div>
            <div className={styles['detail-function-item']}>
              <span className={styles['detail-function-name']}>Region</span>
              <span className={styles['detail-function-value']}>hongkong</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(Detail, (prev, next) => {
  return (
    prev.detailsLoading === next.detailsLoading &&
    prev.deploymentDetails?.id === next.deploymentDetails?.id &&
    prev.deployments.length === next.deployments.length
  );
});
