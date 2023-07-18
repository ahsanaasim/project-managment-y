import NoSSR from "../components/NoSSR"
import TopMenu from "../components/TopMenu";

const Layout = ({
    children,
  }: {
    children: React.ReactNode
  }) => <NoSSR>
    <TopMenu />
    {children}
  </NoSSR>

export default Layout;