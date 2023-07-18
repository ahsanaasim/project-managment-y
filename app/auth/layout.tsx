import NoSSR from "../components/NoSSR"
import TopMenu from "../components/TopMenu";

const layout = ({
    children,
  }: {
    children: React.ReactNode
  }) => <NoSSR>
    <TopMenu />
    {children}
  </NoSSR>

export default layout;