import { Menu, MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  getItem("Info", "1"),
  getItem("Other Details", "2"),
  getItem("Stakeholders", "3"),
  getItem("RACI Stakeholders", "4"),
  getItem("Working Groups Stakeholders", "5"),
  getItem("Documents", "6"),
  getItem("Recommendations", "7"),
];

const getCurrentPageNavkey = (path: string) => {
  const pathArray = path.split("/");
  return pathArray.pop();
};

const Page = () => {
  const path = usePathname();
  const router = useRouter();
  const [current, setCurrent] = useState(getCurrentPageNavkey(path));
  const step = path.split("/").pop();

  const navbarHandler: MenuProps["onClick"] = (e) => {
    const projectId = e.key == "1" ? "" : "/" + path.split("/")[2];
    router.push(`/project${projectId}/${e.key}`);
    setCurrent(e.key);
  };

  // useEffect(() => {
  //   console.log("changed");

  //   setCurrent(path.split("/").pop());
  // }, [router]);

  return (
    <Menu
      onClick={navbarHandler}
      style={{ width: "100%" }}
      defaultSelectedKeys={[current as string]}
      mode="inline"
      items={items}
    />
  );
};

export default Page;
