import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useParams, useNavigate } from 'react-router';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from 'components/console/store';
import Metrics from './metrics';
import Detail from './detail/detail';
import Deployments from './deployments';
import Domains from './domains';
import Tables from './tables';
import styles from '../project.module.scss';
import { useProjectDomainsService } from 'service/useProjectDomains';
import { Score, useDeploymentDetailsService } from 'service/useDeploymentDetails';
import Development from './development';

const ProjectTabs = () => {
  const { featureFlag } = useSelector((state: RootState) => {
    return state.user;
  });
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const params = useParams();
  const [deploymentList, setDeploymentList] = useState<any[]>([]);
  const projectName = params.name;

  const {
    deploymentDetails,
    projectType,
    loading,
    getDeploymentDetails,
    containsDynamic,
    deployments,
    hasNextPage,
    endCursor,
    fetchMore,
  } = useDeploymentDetailsService({
    projectName,
  });

  const { data, getProjectDomains } = useProjectDomainsService({ projectName });

  const projectID = data?.id;
  const domains = data?.domains || [];

  useEffect(() => {
    getProjectDomains();
    getDeploymentDetails();
  }, []);

  console.log(projectID, deploymentDetails);

  useEffect(() => {
    if (projectType) dispatch.project.setType(projectType);
  }, [projectType]);

  useEffect(() => {
    if (deployments.length > 0) {
      setDeploymentList([...deploymentList, ...deployments]);
    }
  }, [deployments]);

  return (
    <div className={styles['project-tabs-container']}>
      <Head>
        <title>{projectName} - Project</title>
        <meta name="description" content={projectName + 'Project Console'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style global jsx>{`
        .ant-tabs {
          overflow: unset;
        }
        .ant-tabs .ant-tabs-nav {
          position: fixed;
          width: 100%;
          background-color: #f5f7fa;
          z-index: 999;
        }
        .ant-tabs .ant-tabs-content {
          padding-top: 82px;
        }
      `}</style>
      <Tabs
        onChange={(ak) => {
          navigate(`../${ak}`);
        }}
        activeKey={params.tab}
        size={'large'}
        className={styles['project-tabs']}
        tabBarStyle={{ fontSize: '18px' }}
      >
        <Tabs.TabPane tab="Details" key="details">
          <div className={styles['project-details']}>
            <Detail
              deploymentDetails={deploymentDetails}
              detailsLoading={loading}
              deployments={deploymentList}
              hasNext={hasNextPage}
              fetchMore={() =>
                fetchMore({
                  variables: {
                    cursor: endCursor,
                  },
                })
              }
            />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Deployments" key="deployments">
          <Deployments projectName={projectName} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Development" key="development">
          {projectID && <Development projectID={projectID} />}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Domains" key="domains">
          <Domains domains={domains} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Metrics" key="metrics">
          {projectID && <Metrics projectID={projectID} containsDynamic={containsDynamic} />}
        </Tabs.TabPane>
        {featureFlag.enableTables && (
          <Tabs.TabPane tab="Tables" key="tables">
            {projectID && <Tables projectID={projectID} />}
          </Tabs.TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default ProjectTabs;
