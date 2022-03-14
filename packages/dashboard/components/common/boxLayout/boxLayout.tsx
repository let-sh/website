import * as React from 'react';
import './boxLayout.module.scss';

interface BoxLayoutProps {
  child: any;
}

function BoxLayout({ child }: BoxLayoutProps) {
  return <div className="box-layout">{child}</div>;
}

export default BoxLayout;
