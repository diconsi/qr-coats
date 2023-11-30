import { homeClubesPath } from "@/constants";
import { useRedirectTo } from "@/hooks";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Completion = () => {
  const location = useLocation();
  const redirecTo = useRedirectTo();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectStatus = params.get("redirect_status");

    if (redirectStatus === "succeeded") {
      redirecTo(homeClubesPath);
    } else {
      // Redirigir al usuario a una página de error
      console.log("malo");
    }
    debugger
  }, [location.search]);

  return <div>Thank you</div>;
};

export default Completion;
