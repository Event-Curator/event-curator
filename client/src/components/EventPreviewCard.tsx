import { Link } from "react-router";

// Import category images
import musicImg from "../assets/music.jpg";
import businessImg from "../assets/business.jpg";
import foodImg from "../assets/food.jpg";
import communityImg from "../assets/community.jpg";
import performanceImg from "../assets/performance.jpg";
import mediaImg from "../assets/media.jpg";
import sportImg from "../assets/sport.jpg";
import healthImg from "../assets/health.jpg";
import scienceImg from "../assets/science.jpg";
import travelImg from "../assets/travel.jpg";
import charityImg from "../assets/charity.jpg";
import religionImg from "../assets/religion.jpg";
import familyImg from "../assets/family.jpg";
import seasonalImg from "../assets/seasonal.jpg";
import governmentImg from "../assets/government.jpg";
import fashionImg from "../assets/fashion.jpg";
import homeImg from "../assets/home.jpg";
import autoImg from "../assets/auto.jpg";
import hobbiesImg from "../assets/hobbies.jpg";
import schoolImg from "../assets/school.jpg";
import otherImg from "../assets/other.jpg";

// Category to image mapping
const categoryImages: Record<string, string> = {
  "Music": musicImg,
  "Business & Professional": businessImg,
  "Food & Drink": foodImg,
  "Community & Culture": communityImg,
  "Performing & Visual Arts": performanceImg,
  "Film, Media & Entertainment": mediaImg,
  "Sports & Fitness": sportImg,
  "Health & Wellness": healthImg,
  "Science & Technology": scienceImg,
  "Travel & Outdoor": travelImg,
  "Charity & Causes": charityImg,
  "Religion & Spirituality": religionImg,
  "Family & Education": familyImg,
  "Seasonal & Holiday": seasonalImg,
  "Government & Politics": governmentImg,
  "Fashion & Beauty": fashionImg,
  "Home & Lifestyle": homeImg,
  "Auto, Boat & Air": autoImg,
  "Hobbies & Special Interest": hobbiesImg,
  "School Activities": schoolImg,
  "Other": otherImg,
};

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

  const imageSrc = categoryImages[category] || otherImg;

  return (
    <Link
      to={`/event/${id}`}
      className="flex bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-blue-50"
      style={{ minHeight: 120 }}
    >
      <div className="w-32 h-28 flex-shrink-0">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover"
        />
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
