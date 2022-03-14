import { AppProps } from 'next/app';
import Script from 'next/script';
import { FC, useEffect } from 'react';
import TagManager from 'react-gtm-module';
import Aegis from 'aegis-web-sdk';
import { initializeApp } from 'firebase/app';
import { initializePerformance } from 'firebase/performance';
import Router from "next/router";
import 'antd/dist/antd.css';
import 'assets/style/tailwind.scss';
import './nprogress.css';
import './index.scss';

import nProgress from "nprogress";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-K4XN9CR' });

    // tencent cloud aegis apm
    // const aegis = new Aegis({
    //   id: 'e18J4KBxEaROAEZrLY', // 应用ID，即上报key
    //   reportApiSpeed: true, // 接口测速
    //   reportAssetSpeed: true, // 静态资源测速
    //   spa: true, // spa 应用页面跳转的时候开启 pv 计算
    // });

    // firebase performance
    var firebaseConfig = {
      apiKey: 'AIzaSyBsYkpvrBBYGqbK6paV3btJrEAdPuOazhU',
      authDomain: 'let-site.firebaseapp.com',
      databaseURL: 'https://let-site.firebaseio.com',
      projectId: 'let-site',
      storageBucket: 'let-site.appspot.com',
      messagingSenderId: '781188574452',
      appId: '1:781188574452:web:6d47dd41c6ed2e9ac5c2a1',
      measurementId: 'G-XRDBZLJL1C',
    };
    const firebaseApp = initializeApp(firebaseConfig);
    const perf = initializePerformance(firebaseApp);
  }, []);
  return (
    <>
      <Script strategy='lazyOnload' dangerouslySetInnerHTML={{
        __html: ` (function(d,t) {
          var BASE_URL="https://app.chatwoot.com";
          var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
          g.src=BASE_URL+"/packs/js/sdk.js";
          g.defer = true;
          g.async = true;
          s.parentNode.insertBefore(g,s);
          g.onload=function(){
            window.chatwootSDK.run({
              websiteToken: 'LPpodkoHHbcqjhQyZa1N7y3x',
              baseUrl: BASE_URL
            })
          }
        })(document,"script");`
      }}>
      </Script>
      <div suppressHydrationWarning>{<Component {...pageProps} />}</div>
    </>
  );
}
export default App;
