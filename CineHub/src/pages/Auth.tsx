import { useState } from "react";
import SignIn from "../components/Auth/SignIn";
import SignUp from "../components/Auth/SignUp";
// import { useCurrentViewport } from "../hooks/useCurrentViewport";

function Auth() {
  const [isShowSignInBox, setIsShowSignInBox] = useState(true);
  //   const { isMobile } = useCurrentViewport();

  return (
    <>
      <div
        style={{ backgroundImage: `url("../signup-img.jpg")` }}
        className="relative bg-cover bg-center bg-no-repeat min-h-screen"
      >
        <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-br from-transparent to-black/70 ">
          {isShowSignInBox && (
            <SignIn setIsShowSignInBox={setIsShowSignInBox} />
          )}
          {!isShowSignInBox && (
            <SignUp setIsShowSignInBox={setIsShowSignInBox} />
          )}
        </div>
      </div>
    </>
  );
}

export default Auth;
