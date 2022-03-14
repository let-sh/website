import React from 'react';
import Head from 'next/head';
import Script from 'next/script';

const CommonHead: React.FunctionComponent = () => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href="/static/favicon.ico" type="image/png"></link>
      <title key="title">let.sh - All in one dev & deploy service</title>
      {/* <script src="//code.tidio.co/dkunlsrtgtbrbmxu7znmyqmk6ckgxloq.js" async></script> */}
    </Head>
  );
};

export default CommonHead;
