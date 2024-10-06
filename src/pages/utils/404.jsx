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
    <>
      <div className="hero bg-white dark:bg-base-200 ">
        <div className="hero-content text-accent text-center h-[37rem]">
          <div className="max-w-md">
            <FaFaceFrown className="h-24 lg:h-48 w-24 lg:w-48 inline-block" />
            <h1 className="text-3xl lg:text-5xl font-bold">404 - Not Found</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page404;
