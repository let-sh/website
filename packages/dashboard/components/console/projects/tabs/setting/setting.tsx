import React from 'react';
import Head from 'next/head';
interface Props {}

class Settings extends React.Component<Props> {
  static defaultProps = {
    language: null,
  };

  render() {
    return (
      <div>
        <Head>
          <title> Settings - let.sh</title>
          <meta name="description" content="Domains Console"  />
        </Head>
        setting
      </div>);
  }
}

export default Settings;
