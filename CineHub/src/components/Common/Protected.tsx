import { Navigate } from "react-router-dom";

interface ProtectedProps {
  isSignedIn: boolean;
  children: React.ReactNode;
}

function Protected({ isSignedIn, children }: ProtectedProps) {
  if (!isSignedIn) return <Navigate to={"/"} replace />;
  return <>{children}</>;
}

export default Protected;
