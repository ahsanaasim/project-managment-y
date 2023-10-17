import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

const AddRowButton = ({ addRow }: { addRow: () => void }) => {
  return (
    <Button type="primary" onClick={addRow} icon={<PlusCircleOutlined />}>
      Add New RACI
    </Button>
  );
};

export default AddRowButton;
