import React, { useState } from 'react';
import style from './stepTabs.module.scss';
import Step from './step';
import { CertificatStatus, getStatusFromCert, getStepFromCert } from './utils';
import classNames from 'classnames';

interface StepTabsProps {
  certificateStatus: CertificatStatus;
  children: JSX.Element[];
}

function StepTabs({ certificateStatus, children }: StepTabsProps) {
  const [tab, setTab] = useState(getStepFromCert(certificateStatus));
  return (
    <div
      className="flex"
      style={{
        paddingBottom: 18,
      }}
    >
      <div>
        <Step
          step={1}
          status={getStatusFromCert(certificateStatus, 1)}
          active={tab === 1}
          onClick={() => {
            setTab(1);
          }}
        />
        <Step
          step={2}
          status={getStatusFromCert(certificateStatus, 2)}
          active={tab === 2}
          onClick={() => {
            setTab(2);
          }}
        />
      </div>
      <div
        className={classNames(
          style['tab-container'],
          style[getStatusFromCert(certificateStatus, tab)]
        )}
      >
        {children[tab - 1]}
      </div>
    </div>
  );
}

export default StepTabs;
