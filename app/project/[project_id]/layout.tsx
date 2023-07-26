import ProjectProvider from "@/app/context/ProjectProvider";

const Layout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    return <ProjectProvider>{children}</ProjectProvider>
  }

export default Layout;