import styles from './ContentCircle.module.scss';

interface ConetntCircleProps {
  className?: string;
  title?: string;
  content: string[];
  direction?: string;
}

const classNames: Record<string, string> = {
  left: styles['circle-content-left'],
  right: styles['circle-content-right'],
};

function ConetntCircle({ className, title, content, direction }: ConetntCircleProps) {
  const contentItems = [];
  for (const [index, value] of content.entries()) {
    contentItems.push(<p key={index}>{value}</p>);
  }

  return (
    <div>
      <div className={className}>
        <div className={styles['circle']}>
          <div className={classNames[direction || 'left']}>
            <h2>{title}</h2>
            {contentItems}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ConetntCircle;
