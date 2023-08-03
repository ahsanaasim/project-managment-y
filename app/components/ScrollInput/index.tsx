import TextArea from "antd/es/input/TextArea";
import React from "react";

const ScrollInput = ({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
}) => {
  return (
    <TextArea
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      style={{ maxHeight: "100px", overflowY: "scroll" }}
    ></TextArea>
  );
};

export default ScrollInput;
