import { EMBED_MOVIE, EMBED_TV, IMAGE_URL } from "./contants";

// Resize image
export const resizeImage = (
  imageUrl: string,
  width: string = "original"
): string => `${IMAGE_URL}/${width}${imageUrl}`;

// EMBEDED MOVIE, TV seasons
export const embedMovie = (id: number): string => `${EMBED_MOVIE}/${id}`;
export const embedTV = (id: number, season: number, episode: number): string =>
  `${EMBED_TV}/${id}&s=${season}&e=${episode}`;

export const getRandomAvatar = (): string => {
  const avatars = [
    "https://i.ibb.co/vJmZmMR/catface-1.jpg",
    "https://i.ibb.co/B44LRzg/catface-2.jpg",
    "https://i.ibb.co/vDcSD5q/cau-vang.png",
    "https://i.ibb.co/WvmywC1/pikachu.png",
    "https://i.ibb.co/DwVNM1N/duck.jpg",
    "https://i.ibb.co/3f0bLXw/doremon.jpg",
  ];

  return avatars[Math.floor(Math.random() * avatars.length)];
};

// export const getRandomAvatar1 = async (): Promise<string> => {
//   const imageDefaultList = ref(storage, "default-images");
//   try {
//     const response = await listAll(imageDefaultList);
//     const results = await Promise.all(
//       response.items.map((item) => getDownloadURL(item))
//     );
//     const data: string = results[Math.floor(Math.random() * results.length)];
//     return data;
//   } catch (error) {
//     console.error("Error in getRandomAvatar1:", error);
//     throw error;
//   }
// };

export const convertErrorCodeToMessage = (errorCode: string): string => {
  if (errorCode === "auth/email-already-in-use")
    return "Your email is already in use.";
  if (errorCode === "auth/user-not-found")
    return "Your email may be incorrect.";
  if (errorCode === "auth/wrong-password") return "Your password is incorrect.";
  if (errorCode === "auth/invalid-email") return "Your email is invalid";
  if (errorCode === "auth/too-many-requests")
    return "You request too many times!";
  return "Something weird happened.";
};

export const calculateTimePassed = (time: number): string => {
  const unit = {
    year: 12 * 30 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
  };

  const diff = Date.now() - time;
  for (const key in unit) {
    if (diff > unit[key as keyof typeof unit]) {
      const timePassed = Math.floor(diff / unit[key as keyof typeof unit]);
      return `${timePassed} ${key}${timePassed > 1 ? "s" : ""}`;
    }
  }

  return "Just now";
};
