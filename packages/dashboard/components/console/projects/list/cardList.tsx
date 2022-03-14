import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Spin, Row, Col } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import dayjs from 'dayjs';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import cls from 'classnames';
import sampleImg from 'assets/img/vscode.png';
import styles from './cardlist.module.scss';
import { useSelector } from 'react-redux';
import { Dispatch, RootState } from 'components/console/store';

enum ProjectField {
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

interface IDeployments {
  id: string;
  targetFQDN: string;
  createdAt: string;
  type: string;
}

enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

interface IProject {
  edges: {
    node: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      deployments: Array<IDeployments>;
      domains: {
        domain: string;
        id: string;
      }[];
    };
  }[];
}

function useProjects(): [boolean, IProject['edges']] {
  const [projects, setProjects] = useState<IProject['edges']>([]);
  const { loading, data } = useQuery<{ projects: IProject }>(
    gql`
      query projects($first: Int, $orderBy: ProjectOrder) {
        projects(first: $first, orderBy: $orderBy) {
          edges {
            node {
              id
              name
              description
              createdAt
              updatedAt
              deployments {
                id
                targetFQDN
                createdAt
                type
              }
              domains {
                domain
                id
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        first: 100,
        orderBy: {
          direction: OrderDirection.DESC,
          field: ProjectField.UPDATED_AT,
        },
      },
    }
  );

  useEffect(() => {
    if (loading === false && data) {
      setProjects(data.projects.edges);
    }
  }, [loading, data]);

  return [loading, projects];
}

const ProjectCardList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, projects] = useProjects();
  const timezone = useSelector((state: RootState) => state.user.preference.timezone);
  if (loading) {
    return <Spin />;
  }

  return (
    <Row
      gutter={[30, 30]}
      style={{
        marginTop: 26,
      }}
    >
      {projects.map(({ node: item }) => {
        const { id, name, domains } = item;
        return (
          <Col key={id} flex="0 1 290px">
            <div className={styles['project-card']}>
              <div
                className={styles['project-card-bg']}
                onClick={() => {
                  navigate(`${location.pathname}/${name}`);
                }}
                style={{
                  background: `url(${sampleImg}) center`,
                  backgroundSize: 'cover',
                }}
              ></div>
              <div className={cls('pl-5 relative', styles['project-card-detail'])}>
                <div className={styles['project-card-type']}>
                  {item?.deployments[0]?.type || 'unkown'}
                </div>
                <div className={styles['project-card-name']}>{name}</div>
                <div className={styles['project-card-time']}>
                  {dayjs(item.updatedAt).tz(timezone).format('YYYY-MM-DD HH:mm')}
                </div>
                {domains &&
                  domains.map(({ domain, id }) => {
                    return (
                      <a
                        className={styles['project-card-domain']}
                        key={id}
                        href={`https://${domain}`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >{`https://${domain}`}</a>
                    );
                  })}
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default ProjectCardList;
