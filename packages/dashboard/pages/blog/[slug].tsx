import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from 'components/blog/container'
import PostBody from 'components/blog/post-body'
import Header from 'components/dashboard/header';
import PostHeader from 'components/blog/post-header'
import Layout from 'components/blog/layout'
import { getPostBySlug, getAllPosts } from 'lib/blog-api'
import PostTitle from 'components/blog/post-title'
import Head from 'next/head'
import CommonHead from 'components/common/head';
import { CMS_NAME } from 'lib/constants'
import markdownToHtml from 'lib/markdownToHtml'
import PostType from 'components/blog/types/post'

type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}
export default function Post({ post, morePosts, preview }: Props ) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>

      <CommonHead />
      
      <Header />
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
            <>
              <div className="poster absolute left-0 top-0 w-screen h-3/4 overflow-hidden" 
                style={{
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: 'url("' + post.coverImage + '")',
                  filter: 'brightness(128%)',
                }}>
                <div className="container mx-auto px-5 mt-20">
                  <Head>
                    <title>
                      {post.title} | let.sh blog
                    </title>
                      { post.ogImage && <meta property="og:image" content={post.ogImage.url} />}
                  </Head>
                  <PostHeader
                    title={post.title}
                    coverImage={post.coverImage}
                    date={post.date}
                    author={post.author}
                    color={ post.titleColor}
                  />
                </div>
              </div>
              <article className="mb-32 pt-12" style={{marginTop:'60vh'}}>
                <PostBody content={post.content} />
              </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }:Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
    'titleColor',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}