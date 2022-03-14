import dayjs from 'dayjs';
import { Chart } from '@antv/g2';
import { MetricsGqlRes, MetricType } from './types';

function getMetricsFromData(data: MetricsGqlRes, timezone?: string) {
  const { metrics, period, startTime, endTime } = data.metrics;
  // const map: { [key: number]: boolean; [p: string]: boolean } = {};
  // for (let i = Number(new Date(startTime)); i <= Number(new Date(endTime)); i += period * 1000) {
  //   map[i] = false;
  // }

  const newMetrics = metrics.map((a) => {
    return {
      ...a,
      time: dayjs(a.time).tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
    };
  });

  // Object.keys(map)
  //   .filter((item) => !map[item])
  //   .forEach((time) => {
  //     metrics.push({
  //       value: 0,
  //       time: dayjs(Number(time)).tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
  //     });
  //   });

  // metrics.sort((a, b) => (dayjs(a.time).isBefore(dayjs(b.time)) ? -1 : 1));

  return newMetrics;
}

function formatter(text: string, type: MetricType) {
  switch (type) {
    case MetricType.Traffic:
      return `${text} kb`;
    default:
      return text;
  }
}

let MetricsMap: Record<any, Chart> = {};

export function handleData(
  data: MetricsGqlRes,
  container: string,
  type: MetricType,
  timezone?: string
) {
  const {
    extend: { deployments },
  } = data.metrics;
  const metrics = getMetricsFromData(data, timezone);

  if (type === MetricType.Traffic) {
    metrics.forEach((metric) => {
      metric.value = +(metric.value / 1000).toFixed(2);
    });
  }

  if (MetricsMap[type]) {
    MetricsMap[type].changeData(metrics);
    return;
  }

  const chart = new Chart({
    container,
    autoFit: true,
    height: 300,
    renderer: 'svg',
  });
  chart.data(metrics);

  chart.scale('value', {
    nice: true,
  });
  chart.axis('value', {
    label: {
      formatter: (text) => formatter(text, type),
    },
  });
  chart.tooltip({
    showCrosshairs: true,
    title: (title, datum) => datum['time'],
  });

  chart.option('slider', {});

  chart.line().position('time*value').shape('smooth');
  chart.area().position('time*value').shape('smooth');

  deployments.forEach((deployment) => {
    chart.annotation().dataMarker({
      top: true,
      position: [deployment.createdAt, 0],
      text: {
        content: `deployment: ${dayjs(deployment.createdAt)
          .tz(timezone)
          .format('YYYY-MM-DD HH:mm:ss')}`,
      },
      line: {
        length: 210,
      },
    });
  });

  chart.render();

  MetricsMap[type] = chart;
}

export function clearChartMap() {
  MetricsMap = {};
}
