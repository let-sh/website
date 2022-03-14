import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { MetricsState, MetricType } from './types';
import { handleData, clearChartMap } from './utils';
import { useSelector } from 'react-redux';
import { RootState } from 'components/console/store';

import styles from './index.module.scss';
import classNames from 'classnames';

const useFetchData = (
  projectID: string,
  type: string,
  startTime?: string,
  endTime?: string,
  channel?: string
) => {
  const [getMetrics, { loading, data }] = useLazyQuery<
    {
      metricType: string;
      period: number;
      metrics: {
        time: string;
        value: number;
      }[];
    }[],
    {
      projectID: string;
      type: string;
      startTime?: string;
      endTime?: string;
      channel?: string;
    }
  >(
    gql`
      query (
        $projectID: UUID!
        $type: String!
        $startTime: Time
        $endTime: Time
        $channel: String
      ) {
        metrics(
          type: $type
          startTime: $startTime
          endTime: $endTime
          projectID: $projectID
          channel: $channel
        ) {
          metricType
          period
          metrics {
            time
            value
          }
          extend {
            deployments {
              createdAt
            }
          }
          startTime
          endTime
        }
      }
    `,
    {
      variables: {
        projectID,
        type,
        startTime,
        endTime,
        channel,
      },
    }
  );

  return [getMetrics, { loading, data }] as any;
};

function Metrics({ projectID, containsDynamic }: { projectID: string; containsDynamic?: boolean }) {
  const [date, setStartDate] = useState(() => {
    const defaultDate = dayjs(Date.now() - 3600 * 1000).format('YYYY-MM-DDTHH:mm:ssZ');
    return defaultDate;
  });

  const [switchDate, setSwitchDate] = useState('1h');
  const [env, setEnv] = useState('prod');
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const timezone = useSelector((state: RootState) => state.user.preference.timezone);

  // const [metricsType, setMetricsType] = useState<string>('invocation');
  const [getDurationMetrics, { loading: durationLoading, data: durationData }] = useFetchData(
    projectID,
    MetricType.Duration,
    date,
    undefined,
    env
  );
  const [getMaxMemoryMetrics, { loading: memoryLoading, data: memoryData }] = useFetchData(
    projectID,
    MetricType.MaxMemory,
    date,
    undefined,
    env
  );
  const [getInvocationMetrics, { loading: invocationLoading, data: invocationData }] = useFetchData(
    projectID,
    MetricType.Invocation,
    date,
    undefined,
    env
  );
  const [getTrafficMetrics, { loading: trafficLoading, data: trafficData }] = useFetchData(
    projectID,
    MetricType.Traffic,
    date,
    undefined,
    env
  );
  const [getRequestMetrics, { loading: requestLoading, data: requestData }] = useFetchData(
    projectID,
    MetricType.Traffic,
    date,
    undefined,
    env
  );
  const [getIPMetrics, { loading: ipLoading, data: ipData }] = useFetchData(
    projectID,
    MetricType.IP,
    date,
    undefined,
    env
  );

  function isLoading() {
    return (
      durationLoading ||
      memoryLoading ||
      invocationLoading ||
      trafficLoading ||
      requestLoading ||
      ipLoading
    );
  }
  useEffect(() => {
    return () => {
      clearChartMap();
    };
  }, []);

  useEffect(() => {
    if (projectID) {
      if (containsDynamic) {
        getInvocationMetrics();
        getDurationMetrics();
        getMaxMemoryMetrics();
      }

      getTrafficMetrics();
      getRequestMetrics();
      getIPMetrics();
    }
  }, [projectID, date, env, containsDynamic]);

  useEffect(() => {
    if (memoryData && memoryData.metrics) {
      handleData(memoryData, 'memory-metric-container', MetricType.MaxMemory);
      if (!isLoading() && fetchTrigger) {
        message.success('refresh data succeed');
        setFetchTrigger(false);
      }
    }
  }, [memoryData?.metrics?.startTime, memoryData?.metrics?.endTime]);

  useEffect(() => {
    if (durationData && durationData.metrics) {
      handleData(durationData, 'duration-metric-container', MetricType.Duration);
      if (!isLoading() && fetchTrigger) {
        message.success('refresh data succeed');
        setFetchTrigger(false);
      }
    }
  }, [durationData?.metrics?.startTime, durationData?.metrics?.endTime]);

  useEffect(() => {
    if (invocationData && invocationData.metrics) {
      handleData(invocationData, 'invocation-metric-container', MetricType.Invocation);
      if (!isLoading() && fetchTrigger) {
        message.success('refresh data succeed');
        setFetchTrigger(false);
      }
    }
  }, [invocationData?.metrics?.startTime, invocationData?.metrics?.endTime]);

  useEffect(() => {
    if (trafficData && trafficData.metrics) {
      handleData(trafficData, 'traffic-metric-container', MetricType.Traffic);
      if (!isLoading() && fetchTrigger) {
        message.success('refresh data succeed');
        setFetchTrigger(false);
      }
    }
  }, [trafficData?.metrics?.startTime, trafficData?.metrics?.endTime]);

  useEffect(() => {
    if (ipData && ipData.metrics) {
      console.log('ip data change', ipData);
      handleData(ipData, 'ip-metric-container', MetricType.IP);
      if (!isLoading() && fetchTrigger) {
        message.success('refresh data succeed');
        setFetchTrigger(false);
      }
    }
  }, [ipData?.metrics?.startTime, ipData?.metrics?.endTime]);

  useEffect(() => {
    if (requestData && requestData.metrics) {
      console.log('request data change', requestData);
      handleData(requestData, 'request-metric-container', MetricType.Request);
      if (!isLoading() && fetchTrigger) {
        message.success('refresh data succeed');
        setFetchTrigger(false);
      }
    }
  }, [requestData?.metrics?.startTime, requestData?.metrics?.endTime]);

  return (
    <div>
      <div className="flex justify-between">
        <div className={styles['metrics-date-switch']}>
          <span
            className={classNames({
              [styles['active']]: switchDate === '1h',
            })}
            onClick={() => {
              setSwitchDate('1h');
              setStartDate(dayjs(Date.now() - 3600 * 1000).format('YYYY-MM-DDTHH:mm:ssZ'));
            }}
          >
            1h
          </span>
          <span
            className={classNames({
              [styles['active']]: switchDate === '1d',
            })}
            onClick={() => {
              setSwitchDate('1d');
              setStartDate(dayjs(Date.now() - 3600 * 1000 * 24).format('YYYY-MM-DDTHH:mm:ssZ'));
            }}
          >
            1d
          </span>
          <span
            className={classNames({
              [styles['active']]: switchDate === '7d',
            })}
            onClick={() => {
              setSwitchDate('7d');
              setStartDate(dayjs(Date.now() - 3600 * 1000 * 24 * 7).format('YYYY-MM-DDTHH:mm:ssZ'));
            }}
          >
            7d
          </span>
        </div>
        <div>
          <div className="inline mr-3">
            <Button
              type="primary"
              loading={
                durationLoading ||
                memoryLoading ||
                invocationLoading ||
                trafficLoading ||
                requestLoading ||
                ipLoading
              }
              onClick={() => {
                setFetchTrigger(true);
                if (switchDate === '1h') {
                  setStartDate(dayjs(Date.now() - 3600 * 1000).format('YYYY-MM-DDTHH:mm:ssZ'));
                }
                if (switchDate === '1d') {
                  setStartDate(dayjs(Date.now() - 3600 * 1000 * 24).format('YYYY-MM-DDTHH:mm:ssZ'));
                }
                if (switchDate === '7d') {
                  setStartDate(
                    dayjs(Date.now() - 3600 * 1000 * 24 * 7).format('YYYY-MM-DDTHH:mm:ssZ')
                  );
                }
              }}
              shape="circle"
              icon={<ReloadOutlined className={styles['refresh-icon']} />}
            />
          </div>
          <div className={styles['metrics-date-switch']}>
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
      </div>

      <div className={styles['metrics-container']}>
        <div className={styles['metrics-wrapper']}>
          <div className="flex justify-between items-center">
            <div className={styles['metrics-title']}>IP</div>
          </div>
          <div id="ip-metric-container" style={{ height: 300 }} />
        </div>
        <div className={styles['metrics-wrapper']}>
          <div className="flex justify-between items-center">
            <div className={styles['metrics-title']}>Traffic</div>
          </div>
          <div id="traffic-metric-container" style={{ height: 300 }} />
        </div>
        <div className={styles['metrics-wrapper']}>
          <div className="flex justify-between items-center">
            <div className={styles['metrics-title']}>Request</div>
          </div>
          <div id="request-metric-container" style={{ height: 300 }} />
        </div>
        {containsDynamic && (
          <>
            <div className={styles['metrics-wrapper']}>
              <div className="flex justify-between items-center">
                <div className={styles['metrics-title']}>Invocation</div>
                <div className={styles['metrics-type']}>Functions</div>
              </div>
              <div id="invocation-metric-container" style={{ height: 300 }} />
            </div>
            <div className={styles['metrics-wrapper']}>
              <div className="flex justify-between items-center">
                <div className={styles['metrics-title']}>Duration</div>
                <div className={styles['metrics-type']}>Functions</div>
              </div>
              <div id="duration-metric-container" style={{ height: 300 }} />
            </div>
            <div className={styles['metrics-wrapper']}>
              <div className="flex justify-between items-center">
                <div className={styles['metrics-title']}>MaxMemory</div>
                <div className={styles['metrics-type']}>Functions</div>
              </div>
              <div id="memory-metric-container" style={{ height: 300 }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Metrics;
