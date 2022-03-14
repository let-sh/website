import Alert from 'components/blog/alert'
import Meta from 'components/blog/meta'
import Footer from 'components/dashboard/footer';

type Props = {
  preview?: boolean
  children: React.ReactNode
}

export default function Layout({ preview, children }: Props) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Alert preview={preview} />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
