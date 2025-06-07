import { SessionProvider } from 'next-auth/react'
import '../styles/globals.scss'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
import '../components/Orb/Orb.module.scss'; // Thêm dòng này