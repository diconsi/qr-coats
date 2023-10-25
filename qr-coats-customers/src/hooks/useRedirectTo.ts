import { useNavigate } from "react-router-dom";

const useRedirectTo = () => {
  const navigate = useNavigate();

  const redirectTo = (path:string) => {
    navigate(path);
  };

  return redirectTo;
};

export default useRedirectTo;
