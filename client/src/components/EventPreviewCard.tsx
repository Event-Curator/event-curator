import { Link } from "react-router";
import { categoryImages } from "../assets/categoryImages";

interface EventPreviewCardProps {
  id: string;
  name: string;
  category: string;
  categoryFreeform: string;
  location: string;
  date: string;
  price: number;
  link: string;
  imageUrl?: string; 
}

export default function EventPreviewCard({
  id,
  name,
  category,
  categoryFreeform,
  location,
  date,
  price,
  imageUrl,
}: EventPreviewCardProps) {
  let displayCategory = category;
  if (category === "Other" && categoryFreeform) {
    displayCategory = categoryFreeform;
  }

  const fallbackImage = categoryImages[category] || categoryImages["Other"];

  const imageSrc =
    imageUrl && imageUrl.trim() !== ""
      ? imageUrl
      : fallbackImage;

  return (
    <Link
      to={`/event/${id}`}
      className="flex bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-blue-50"
      style={{ minHeight: 120 }}
    >
      <div className="w-42 h-42 flex-shrink-0">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-between flex-1 p-4">
        <span className="uppercase text-xs font-semibold text-blue-600 mb-1">
          {displayCategory}
        </span>
        <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
        <div className="text-gray-500 text-m mb-2">{date}</div>
        <div className="flex items-center gap-2 text-m text-gray-900">
          <span>{location}</span>
          <span>•</span>
          <span className={price === 0 ? "font-bold text-blue-700" : ""}>
            {price === 0 ? "Free Entry" : `¥${price}`}
          </span>
        </div>
      </div>
    </Link>
  );
}