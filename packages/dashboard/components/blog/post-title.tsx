import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  color?: string
}

export default function PostTitle({ children, color }: Props) {
  return (
    <h1
      className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-4 text-center md:text-left"
      style={{mixBlendMode: "difference", color: color}}>
      {children}
    </h1>
  )
}
