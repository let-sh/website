import Avatar from 'components/blog/avatar'
import DateFormatter from 'components/blog/date-formatter'
import CoverImage from 'components/blog/cover-image'
import PostTitle from 'components/blog/post-title'
import Author from './types/author'

type Props = {
  title: string
  coverImage: string
  date: string
  author: Author
  color: string
}

export default function PostHeader({ title, coverImage, date, author, color }: Props) {
  return (
    <>
      <PostTitle color={color}>{title}</PostTitle>
      <div className="text-xl mb-8">
        <DateFormatter dateString={date} />
      </div>
      <div className="mx-auto absolute bottom-8">
        <div className="block mb-6">
          <Avatar name={author.name} picture={author.picture} />
        </div>
      </div>
    </>
  )
}
