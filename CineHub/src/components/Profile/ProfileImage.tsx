import { HiOutlineUpload } from "react-icons/hi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useAppSelector } from "../../store/hooks";
import { ChangeEvent, useState } from "react";

import axios from "../../shared/axiosClient";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../shared/firebase";
import { ToastContainer, toast } from "react-toastify";
import { convertErrorCodeToMessage } from "../../shared/utils";
import { IMGBB_URL } from "../../shared/contants";

function ProfileImage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isUpdatingImg, setIsUpdatingImg] = useState(false);

  const changeProfileImage = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUpdatingImg(true);
      if (!currentUser || !e.target.files) return;

      const form = new FormData();

      form.append("image", e.target.files[0]);

      const res = await axios({
        method: "post",
        url: `${IMGBB_URL}${import.meta.env.VITE_API_IMGBB_KEY}`,
        data: form,
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      const userRef = doc(db, "users", currentUser.uid);

      updateDoc(userRef, {
        photoUrl: res.data.data.display_url,
      }).finally(() => setIsUpdatingImg(false));
    } catch (error: any) {
      toast.error(convertErrorCodeToMessage(error.code), {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="shrink-0 w-full md:max-w-[400px] px-4 text-center p-4 md:border md:border-gray-lighten ">
        <h1 className="text-gray-txt text-3xl  mb-4">
          {currentUser?.displayName}
        </h1>
        <p className="text-lg text-gray-txt ">{currentUser?.email}</p>

        <div className="flex flex-col justify-center items-center mt-4">
          <div className="w-[200px] h-[200px] relative">
            <LazyLoadImage
              src={currentUser?.photoURL || "/defaultAvatar.jpg"}
              alt="avatar-img"
              className="w-[200px] h-[200px] rounded-full object-cover border border-gray-lighten"
              effect="blur"
            />
            {isUpdatingImg && (
              <div className="border-[4px] border-primary border-t-transparent h-12 w-12 rounded-full animate-spin absolute top-[40%] left-[40%] z-10"></div>
            )}
          </div>
          <label
            htmlFor="upload-img"
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-dark border border-gray-lighten mt-6 hover:bg-dark-light transition duration-300 cursor-pointer"
          >
            <HiOutlineUpload size={25} className="text-primary" />
            <p className="text-gray-txt font-medium">Upload New Photo</p>
          </label>

          <input
            type="file"
            id="upload-img"
            className="hidden"
            accept="image/*"
            onChange={changeProfileImage}
          />

          <div className="px-5 py-3 w-full max-w-sm bg-dark text-gray-txt border border-gray-lighten rounded-md md:rounded-none mt-6 text-base ">
            <p className="mb-4">
              Upload a new avatar. Larger image will be resized automatically.
            </p>
            <p>
              Maxium upload size is <span>1 MB</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileImage;
