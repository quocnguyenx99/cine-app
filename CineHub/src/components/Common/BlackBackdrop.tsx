import { HTMLProps } from "react";

interface BlackBackdropProps {
  className?: string;
  children?: React.ReactNode;
  onCloseBlackBackdrop?: () => void;
}

function BlackBackdrop({
  className,
  children,
  onCloseBlackBackdrop,
  ...others
}: BlackBackdropProps & HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...others}
      onClick={onCloseBlackBackdrop}
      className={`fixed top-0 left-0 w-full h-full bg-black/60 z-[5] ${className}`}
    >
      {children}
    </div>
  );
}

export default BlackBackdrop;
