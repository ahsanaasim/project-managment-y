import NoSSR from "../components/NoSSR"

const layout = ({
    children,
  }: {
    children: React.ReactNode
  }) => <NoSSR>{children}</NoSSR>

export default layout;