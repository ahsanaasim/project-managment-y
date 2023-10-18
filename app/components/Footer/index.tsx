import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import React from "react";

const Footer = ({
  withoutPrevious,
  withoutNext,
  saveHandler,
  confirmationHandlerPrevious,
  confirmationHandlerNext,
}: {
  withoutPrevious?: boolean;
  withoutNext?: boolean;
  saveHandler: React.FormEventHandler;
  confirmationHandlerPrevious?: () => Promise<void>;
  confirmationHandlerNext?: () => Promise<void>;
}) => {
  return (
    <footer>
      <Space>
        {!withoutPrevious && (
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
        {!withoutNext && (
          <Button
            icon={<RightOutlined />}
            onClick={() => confirmationHandlerNext && confirmationHandlerNext()}
          ></Button>
        )}
      </Space>
    </footer>
  );
};

export default Footer;
