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
  getItem("Details", "2"),
  getItem("Stakeholders", "3"),
  getItem("RACI", "4"),
  getItem("Working Groups", "5"),
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

  console.log(step);

  const navbarHandler: MenuProps["onClick"] = (e) => {
    const projectId = e.key == "1" ? "" : "/" + path.split("/")[2];
    router.push(`/project${projectId}/${e.key}`);
    setCurrent(e.key);
  };

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
