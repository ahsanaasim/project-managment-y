import { usePathname } from "next/navigation";

const useProjectId = () => {
  const path = usePathname();
  return path.split("/")[2];
};

export default useProjectId;
