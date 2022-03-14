import * as React from 'react';
import styles from './index.module.scss';
import ContentCircle from './ContentCircle';
import anime from 'animejs';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

interface FeatureItemProps {
  title: string;
  tag: string;
  description?: string;
  expanded?: boolean;
  onClick?: () => void;
  // links: { url: string; name: string; blank?: boolean }[];
}
const FeatureItem = ({
  title,
  tag,
  description,
  expanded,
  onClick = () => {},
}: FeatureItemProps) => {
  return (
    <div
      className={classNames(
        styles['feature-item'],
        'py-4 mb-4 px-6 text-gray-500 bg-white rounded-2xl',
        expanded && styles['feature-item-active'],
        {
          active: expanded,
        }
      )}
      onClick={onClick}
    >
      <div className="flex flex-row items-center justify-between h-full">
        <div className="inline-block text-2xl">{title}</div>
        <div
          className={
            styles['feature-item-tag'] +
            ' inline-block px-3 py-1 text-xl text-right text-white bg-blue-400 rounded-3xl'
          }
        >
          {tag}
        </div>
      </div>

      {expanded && <div className="mt-3 mb-1 text-lg font-normal text-gray-500">{description}</div>}
    </div>
  );
};

const ExpandItem = {
  URL: 'url',
  REQ: 'req',
  DEPLOY: 'deploy',
  HTTPS: 'https',
  METRICS: 'metrics',
};

const videoUrlMap = {
  [ExpandItem.METRICS]: 'https://assets.let.sh.cn/video/lets-metrics-1080.mp4',
  [ExpandItem.DEPLOY]: 'https://assets.let.sh.cn/video/lets-deploy-1080.mp4',
  [ExpandItem.REQ]: 'https://assets.let.sh.cn/video/lets-requests-1080.mp4',
  [ExpandItem.URL]: 'https://assets.let.sh.cn/video/lets-dev-1080.mp4',
  [ExpandItem.HTTPS]: '',
};

function Content() {
  const [expanded, setExpanded] = useState(ExpandItem.URL);

  return (
    <div className={styles['content']}>
      <div className="mx-4 mt-10 mb-32 text-6xl font-bold leading-tight features">
        <p className="">Develop, Deploy and Monitor.</p>
        <p className="text-gray-500">
          With the everything you need, <br />
          from code to online service.
        </p>

        <div className="flex flex-row w-full mt-32 feature-list">
          <div className="w-1/3 mr-3 feature-nav ">
            <FeatureItem
              title="Sharable Url"
              tag="Develop"
              expanded={ExpandItem.URL === expanded}
              onClick={() => {
                setExpanded(ExpandItem.URL);
              }}
              key={ExpandItem.URL}
              description="With `lets dev`, you can expose your local development service publicly. You can share the url with your team and let them preview your service even from localhost."
            ></FeatureItem>
            <FeatureItem
              title="Debug Requests"
              tag="Develop"
              expanded={expanded === ExpandItem.REQ}
              onClick={() => {
                setExpanded(ExpandItem.REQ);
              }}
              key={ExpandItem.REQ}
              description="As you visit the project development page in the console, let.sh will log every request from the development url to help you debug your service."
            ></FeatureItem>
            <FeatureItem
              title="OneClick Deploy"
              tag="Deploy"
              expanded={expanded === ExpandItem.DEPLOY}
              onClick={() => {
                setExpanded(ExpandItem.DEPLOY);
              }}
              key={ExpandItem.DEPLOY}
              description="Once you press `lets deploy` from your CLI, let.sh auto detects your project framework, then direct deploy to our serverless infrastructure. For more you could visit document https://docs.let.sh for details."
            ></FeatureItem>
            <FeatureItem
              title="Auto HTTPS"
              tag="Deploy"
              expanded={expanded === ExpandItem.HTTPS}
              onClick={() => {
                setExpanded(ExpandItem.HTTPS);
              }}
              key={ExpandItem.HTTPS}
              description="Every project deployed to our serverless infrastructure will be automatically converted to HTTPS. Auto HTTPS supports your custom domain either."
            ></FeatureItem>
            <FeatureItem
              title="Online Metrics"
              tag="Monitor"
              expanded={expanded === ExpandItem.METRICS}
              onClick={() => {
                setExpanded(ExpandItem.METRICS);
              }}
              key={ExpandItem.METRICS}
              description="You can directly see the service metrics from the console, including traffic, memeory usage, ips, etc. Besides, We will benchmark every fontend project deployment with lighthouse."
            ></FeatureItem>
          </div>
          <div
            className={`relative bg-white w-2/3 ml-2 overflow-hidden rounded-2xl ${styles['feature-preview-container']}`}
          >
            {Object.keys(ExpandItem).map((item) => {
              item = item.toLocaleLowerCase();
              return (
                <div
                  className={classNames(styles['feature-preview'], 'w-full', {
                    [styles['active']]: item === expanded,
                  })}
                >
                  <video
                    id="feature-preview-video"
                    autoPlay
                    loop
                    muted
                    src={videoUrlMap[item]}
                    preload="metadata"
                    playsInline={true}
                    webkit-playsinline="true"
                    poster={`${videoUrlMap[item]}?x-oss-process=video/snapshot,t_0,f_jpg,w_800,h_600,m_fast`}
                  ></video>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles['content-background']}>
        <div className={styles['content-background-deploy-link']}>
          <div className={styles['content-background-deploy-link-code-circle']}>
            <p>{'< / >'}</p>
          </div>
          <div className={styles['content-background-deploy-link-route']}>
            <img src={require('assets/img/route.svg')} />
          </div>
          <div className={styles['content-background-deploy-link-servers']}>
            <img src={require('assets/img/servers.svg')} />
          </div>
          <div className={styles['content-background-deploy-link-website']}>
            <img src={require('assets/img/website-preview.svg')} />
          </div>
          <div className={styles['content-background-deploy-link-earth']}>
            <img src={require('assets/img/earth.png')} />
          </div>
        </div>
        <ContentCircle
          className={styles['content-background-circle-easy']}
          title="Quite Easy"
          direction="left"
          content={[
            'We built this product for a better developer experience, especially in your command-line interface.',
            'Not only you can directly deploy your frontend project changing ZERO lines of code, but also allows you to deploy your server-side project without changing and scale painlessly.',
            'It could be painful adjusting serverless infrastructure in your existing framework, but we are providing framework-level serverless support just like a piece of cake for you.',
          ]}
        ></ContentCircle>

        <ContentCircle
          className={styles['content-background-circle-fast']}
          title="Blazing Fast"
          direction="right"
          content={[
            'The all-in-one tools could help you deliver your code from development to production as quickly as possible, even faster than you could imagine.',
            'Even in the development stage, you could share your development environment with a single command and any who got your link could visit your app directly.',
          ]}
        ></ContentCircle>
      </div>
    </div>
  );
}

export default Content;
