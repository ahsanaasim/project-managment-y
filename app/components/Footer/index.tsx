import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import React from "react";

const Footer = ({ withPrevious }: { withPrevious?: boolean }) => {
  return (
    <footer>
      <Space>
        {withPrevious && <Button icon={<LeftOutlined />}></Button>}
        <Button type="primary">Save</Button>
        <Button icon={<RightOutlined />}></Button>
      </Space>
    </footer>
  );
};

export default Footer;
