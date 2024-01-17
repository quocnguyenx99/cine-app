import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BlackBackdrop from "../Common/BlackBackdrop";

interface ModalNotificationProps {
  type: string;
  message: string;
  onCloseModal?: () => void;
}

const TIME_AUTO_CLOSE_ERROR = 5;
const TIME_AUTO_CLOSE_SUCCESS = 2;

function ModalNotification({
  type,
  message,
  onCloseModal,
}: ModalNotificationProps) {
  const [timeLeft, setTimeLeft] = useState(
    type === "success" ? TIME_AUTO_CLOSE_SUCCESS : TIME_AUTO_CLOSE_ERROR
  );

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const timeout = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timeout);
  }, []);

  const isAutoCloseModal = timeLeft === 0;
  useEffect(() => {
    if (isAutoCloseModal) {
      if (type === "success") {
        navigate(`${searchParams.get("redirect") || "/"}`);
      } else {
        onCloseModal?.();
      }
    }
  }, [isAutoCloseModal]);

  return (
    <>
      <div
        style={{
          backgroundImage: `${
            type === "success" ? "url('/success.jpg')" : "url('/fail.jpg')"
          }`,
        }}
        className="fixed z-30 min-h-[450px] max-w-[350px] w-full rounded-lg bg-cover bg-no-repeat bg-center tw-absolute-center"
      >
        <div className="mt-[230px] text-black text-[40px] text-center font-bold">
          {type === "success" ? "Woo hoo!" : "Oh no."}
        </div>
        <p className="mt-1 text-gray-600 text-center text-xl font-medium">
          {message}
          <br></br>
          {type === "error" && <span>Keep calm and try again.</span>}
          {type === "success" && <span>Your account has been confirmed.</span>}
        </p>
        <button
          onClick={() => {
            if (type === "success") {
              navigate(`${searchParams.get("redirect") || "/"}`);
            } else {
              onCloseModal?.();
            }
          }}
          className={`${
            type === "success"
              ? "bg-primary shadow-primary hover:bg-blue-600"
              : "bg-red-500 shadow-red-500 hover:bg-red-600"
          } flex gap-2 items-center absolute left-1/2 -translate-x-1/2 mt-5 px-4 py-2 rounded-md shadow-md text-white transition duration-300`}
        >
          <p>{type === "success" ? "CONTINUE" : "TRY AGAIN"}</p>
          <p>{timeLeft}</p>
        </button>
      </div>
      <BlackBackdrop onCloseBlackBackdrop={onCloseModal} />
    </>
  );
}

export default ModalNotification;
