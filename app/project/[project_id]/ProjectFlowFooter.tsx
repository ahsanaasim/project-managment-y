import useProjectId from "@/app/hooks/useProjectId";
import { Button, Space } from "antd";
import React, { FormEventHandler } from "react";

const ProjectFlowFooter = ({
  previous,
  submitForm,
}: {
  previous: number;
  submitForm: FormEventHandler;
}) => {
  const projectId = useProjectId();

  return (
    <Space
      style={{ margin: "2rem 0", display: "flex", justifyContent: "center" }}
    >
      <Button
        href={`/project/${projectId}/${previous}`}
        type="primary"
        style={{ width: "200px" }}
      >
        Back
      </Button>
      <Button
        htmlType="submit"
        // href={`/project/${next}`}
        onClick={submitForm}
        type="primary"
        style={{ width: "200px" }}
      >
        Next
      </Button>
    </Space>
  );
};

export default ProjectFlowFooter;
