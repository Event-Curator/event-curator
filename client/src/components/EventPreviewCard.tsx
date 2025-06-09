import { Link } from "react-router";

interface EventPreviewCardProps {
  id: string;
  name: string;
  category: string;
  categoryFreeform: string;
  location: string;
  date: string;
  price: number;
  link: string;
}

export default function EventPreviewCard({
  id,
  name,
  category,
  categoryFreeform,
  location,
  date,
  price,
}: EventPreviewCardProps) {
  if (category === "Other" && categoryFreeform) {
    category = categoryFreeform;
  }

  return (
    <Link
      to={`/event/${id}`}
      className="flex bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-blue-50"
      style={{ minHeight: 120 }}
    >
      <div className="w-32 h-28 flex-shrink-0">
        {/* <img src="" alt={name} className="w-full h-full object-cover" /> */}
      </div>
      <div className="flex flex-col justify-between flex-1 p-4">
        <span className="uppercase text-xs font-semibold text-blue-600 mb-1">
          {category}
        </span>
        <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
        <div className="text-gray-500 text-xs mb-2">{date}</div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
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
