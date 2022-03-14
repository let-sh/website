import React, { Fragment, useState, useEffect } from 'react';
import Head from 'next/head';
import { Route, useLocation, useNavigate, Routes, useParams, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { parse } from 'qs';
import { useSelector } from 'react-redux';
import { ProjectList, ProjectCardList } from './list';
import ProjectTabs from './tabs';
import Log from './log';
import styles from './project.module.scss';
import { RootState } from '../store';

function Name() {
  const params = useParams();
  const projectState = useSelector((state: RootState) => state.project);
  const navigate = useNavigate();

  return (
    <div className="flex">
      <div
        className={styles['project-selector-container']}
        onClick={() => {
          navigate(`../${params.tab}`);
        }}
      >
        <div className={styles['project-selector-item']}>{params.name}</div>
      </div>
      <Routes>
        <Route
          path="/logs/:id"
          element={
            <>
              <span
                style={{ fontSize: 20, fontWeight: 700, color: '#979797' }}
                className="ml-4 mr-4"
              >
                &gt;
              </span>
              <div className={`${styles['project-dp-version']} flex justify-center items-center`}>
                Deployment: {projectState.version}
              </div>
            </>
          }
        />
      </Routes>
    </div>
  );
}

function Type() {
  const params = useParams();
  const projectState = useSelector((state: RootState) => state.project);
  if (!params.name) return null;

  return (
    <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>type: {projectState.type}</div>
  );
}

const ProjectApp = () => {
  return (
    <div className={styles['project-wrapper']} id="project-wrapper">
      <Head>
        <title> Projects - let.sh</title>
        <meta name="description" content="Projects Console" />
      </Head>
      <Routes>
        <Route path={`/`}>
          <div>
            <div className={styles['project-header']} style={{ position: 'fixed' }}>
              <div className={styles['project-title']}>Projects</div>
              {/* <div className={styles['project-switch']}>
                <>
                  <div
                    onClick={() => {
                      navigate(`?viewMode=list`);
                    }}
                    className={
                      viewMode === 'list'
                        ? styles['project-switch-icon-active']
                        : styles['project-switch-icon']
                    }
                  >
                    <UnorderedListOutlined />
                  </div>
                  <div
                    onClick={() => {
                      navigate('?viewMode=card', { replace: true });
                    }}
                    className={
                      viewMode === 'card'
                        ? styles['project-switch-icon-active']
                        : styles['project-switch-icon']
                    }
                  >
                    <AppstoreOutlined />
                  </div>
                </>
              </div> */}
            </div>
            <ProjectList />
          </div>
        </Route>
      </Routes>
      <Routes>
        <Route
          path={`/:name/:tab/*`}
          element={
            <div
              className="fixed w-full z-50"
              style={{
                backgroundColor: '#f5f7fa',
              }}
            >
              <div className={styles['project-header']}>
                <div className={styles['project-title']}>Project</div>
                <Name />
              </div>
              <Type />
            </div>
          }
        />
      </Routes>
      <Routes>
        <Route path={`/:name`}>
          <Navigate to="details" />
        </Route>
        <Route path={`/:name/:tab`}>
          <ProjectTabs />
          <Route path="/logs/:id" element={<Log />} />
        </Route>
      </Routes>
    </div>
  );
};

export default ProjectApp;
