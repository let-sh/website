import React, { useEffect, useState } from 'react';
import { Divider, Tooltip } from 'antd';
import cls from 'classnames';
import styles from './index.module.scss';
import CommonHead from 'components/common/head';
import Header from 'components/dashboard/header';
import PostGallery from 'components/blog/postGallery/postGallery'
import { CopyOutlined } from '@ant-design/icons';
import Clipboard from 'clipboard';
import { getAllPosts } from 'lib/blog-api'
import Post from 'components/blog/types/post'
import Footer from 'components/dashboard/footer';
export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
type Props = {
  allPosts: Post[]
}
export default function Index({ allPosts }: Props) {
  const [tipVisible, setVisible] = useState(false);
  useEffect(() => {
    const cbd = new Clipboard('#cli-curl');
  }, []);
  const posts = allPosts
  return (
    <>
      <CommonHead />
      <Header />
      <div className="container mx-auto px-5 py-5">
        <PostGallery posts={posts} />
      </div>
      <Footer />
    </>
  );
}
