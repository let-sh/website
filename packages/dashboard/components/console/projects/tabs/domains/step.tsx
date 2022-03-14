import { CheckCircleFilled } from '@ant-design/icons';
import classNames from 'classnames';
import React from 'react';
import style from './step.module.scss';
import { StepStatus } from './utils';

interface StepProps {
  step: number;
  status: StepStatus;
  active?: boolean;
  onClick: any;
}

const text = [
  {
    t1: 'Action Required',
    t2: 'Add CNAME',
  },
  {
    t1: 'Automate',
    t2: 'Sign SSL Cert',
  },
];

const StatusIconMap = {
  [StepStatus.NotReach]: ({ step }: { step: number }) => (
    <div className={style['number-icon']}>{step}</div>
  ),
  [StepStatus.Success]: () => (
    <CheckCircleFilled
      className={style['step-icon']}
      style={{
        color: '#52c41a',
      }}
    />
  ),
  [StepStatus.Pending]: ({ step }: { step: number }) => (
    <div className={`${style['number-icon']} ${style['pending']}`}>{step}</div>
  ),
  [StepStatus.Failed]: ({ step }: { step: number }) => (
    <div className={`${style['number-icon']} ${style['failed']}`}>{step}</div>
  ),
};

function Step({ step, status, active, onClick }: StepProps) {
  const IconStatus = StatusIconMap[status];

  return (
    <div
      className={classNames(style['step-container'], style[status], { [style['active']]: active })}
      onClick={onClick}
    >
      <IconStatus step={step} />
      <div className={style['step-text']}>
        <div className={style['t1']}>{text[step - 1].t1}</div>
        <div className={style['t2']}>{text[step - 1].t2}</div>
      </div>
    </div>
  );
}

export default Step;
