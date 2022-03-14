import React from 'react';

import Header from 'components/dashboard/header';
import Intro from 'components/dashboard/intro';
import Content from 'components/dashboard/content';
import Footer from 'components/dashboard/footer';
import CommonHead from 'components/common/head';

interface Props {}

interface States {}

class Dashboard extends React.Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#E9F4FF',
          zIndex: -100,
        }}
      >
        <CommonHead />
        <Header />
        <Intro />
        <Content />
        <Footer />
      </div>
    );
  }
}

export const getStaticProps = () => {
  return {
    props: {},
  };
};

export default Dashboard;
