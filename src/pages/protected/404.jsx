import { useEffect } from "react";
import { FaFaceFrown } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";

function Page404() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Page Not Found" }));
  }, []);
  return (
    <div className="hero h-4/5 bg-gray-300 dark:bg-base-200">
      <div className="hero-content text-accent text-center">
        <div className="max-w-md">
          <FaFaceFrown className="h-48 w-48 inline-block" />
          <h1 className="text-5xl  font-bold">404 - Not Found</h1>
        </div>
      </div>
    </div>
  );
}

export default Page404;
