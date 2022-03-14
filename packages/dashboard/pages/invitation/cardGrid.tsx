import React from 'react';
import styles from './index.module.scss';
import Card from './card';

function CardGrid() {
  return (
    <div className={styles['cards-container']}>
      <div className={styles['desc-card']}>
        <div className={styles['desc-card-title']}>
          <p>Easy</p>
          <p>Fast</p>
          <p>Secure</p>
        </div>
        <div className={styles['desc-card-text']}>
          We built this product for a better developer experience, especially in your command-line
          interface.
        </div>
      </div>
      <Card
        videoUrl="https://assets.let.sh.cn/video/one-line-deploy.mp4"
        title="One line deployment"
        text="`lets deploy` helps you deploy you project in a minute, even in seconds."
        clickUrl="https://docs.let.sh/"
      />
      <Card
        videoUrl="https://assets.let.sh.cn/video/automate-https.mp4"
        title="Framwork-level support"
        text="directly deploy your services from you local cli"
        clickUrl="https://docs.let.sh/handbook/react"
      />
      <Card
        videoUrl="https://assets.let.sh.cn/video/automate-https.mp4"
        title="Automate HTTPS"
        text="let.sh will automate serve your projects with https support "
        clickUrl="https://docs.let.sh/network/https"
      />
      <Card
        videoUrl="https://assets.let.sh.cn/video/out-of-box.mp4"
        title="Out of the box"
        text="In most cases, you do not need to change any code to run your project on let.sh"
        clickUrl="https://docs.let.sh/"
      />
      <Card
        videoUrl="https://assets.let.sh.cn/video/localtunnel.mp4"
        title="Local tunnel to cloud"
        text="`lets dev` help you run your service with a public endpoint can be shared with others"
        clickUrl="https://docs.let.sh/cli/commands#dev"
      />
    </div>
  );
}

export default CardGrid;
