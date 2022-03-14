import Container from './container'
import cn from 'classnames'
import { EXAMPLE_PATH } from 'lib/constants'
type Props = {
  preview?: boolean
}

export default function Alert({ preview }: Props) {
  return (
    <div
      className={cn( {
        'bg-accent-7 border-accent-7 text-white': preview,
        'bg-accent-1 border-accent-2': !preview,
      })}
    >
      <Container>
        <div className="text-center text-sm">
        </div>
      </Container>
    </div>
  )
}
