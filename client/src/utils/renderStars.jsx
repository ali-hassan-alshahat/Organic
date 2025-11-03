import { Star } from "lucide-react";

export const renderStars = (rating = 0) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={20}
        className={`${
          i <= Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : i - rating < 1
            ? "text-yellow-300 fill-yellow-300"
            : "text-gray-300"
        }`}
      />,
    );
  }
  return stars;
};
