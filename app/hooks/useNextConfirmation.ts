import { Modal } from "antd";
import { useRouter } from "next/navigation";

const useNextConfirmation = () => {
  const router = useRouter();

  const showConfirm = (projectId: string, nextStep: number) => {
    const { confirm } = Modal;

    confirm({
      title: "You have unsaved changes.",
      okText: "Continue without Saving",
      cancelText: "Cancel",
      onOk() {
        router.push(`/project/${projectId}/${nextStep}`);
      },
    });
  };

  return showConfirm;
};

export default useNextConfirmation;
