import Avatar from 'components/blog/avatar'
import DateFormatter from 'components/blog/date-formatter'
import CoverImage from 'components/blog/cover-image'
import Link from 'next/link'
import Author from '../types/author'

type Props = {
  title: string
  coverImage: string
  date: string
  excerpt: string
  author: Author
  slug: string
}

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <div className="blog-card rounded-3xl overflow-hidden"
      style={{ boxShadow: "0 2px 20px 0 rgb(0 0 0 / 10%)", transition: '0.2s' }}>
      <div className="">
        <CoverImage
          slug={slug}
          title={title}
          src={coverImage}
          height={278}
          width={556}
        />
      </div>
      <div className="p-6">
        <h3 className="text-3xl mb-3 leading-snug">
        <Link as={`/blog/${slug}`} href="/blog/[slug]">
        <a className="hover:underline">{title}</a>
        </Link>
        </h3>
        <div className="text-lg mb-4">
            <DateFormatter dateString={date} />
        </div>
        <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
        <Avatar name={author.name} picture={author.picture} />
      </div>
    </div>
  )
}