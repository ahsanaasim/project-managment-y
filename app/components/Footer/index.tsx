import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import React from "react";

const Footer = ({
  withPrevious,
  saveHandler,
  confirmationHandlerPrevious,
  confirmationHandlerNext,
}: {
  withPrevious?: boolean;
  saveHandler: React.FormEventHandler;
  confirmationHandlerPrevious?: () => Promise<void>;
  confirmationHandlerNext: () => Promise<void>;
}) => {
  return (
    <footer>
      <Space>
        {withPrevious && (
          <Button
            onClick={() => {
              confirmationHandlerPrevious && confirmationHandlerPrevious();
            }}
            icon={<LeftOutlined />}
          ></Button>
        )}
        <Button type="primary" onClick={saveHandler}>
          Save
        </Button>
        <Button
          icon={<RightOutlined />}
          onClick={() => confirmationHandlerNext()}
        ></Button>
      </Space>
    </footer>
  );
};

export default Footer;
