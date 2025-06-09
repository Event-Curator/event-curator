export type EventType = {
  externalId: string;
  name: string;
  category: string;
  categoryFreeform?: string;
  placeFreeform?: string;
  datetimeFrom: string;
  budgetMin: number;
  teaserMedia?: string;
  [key: string]: unknown;
};

export const eventCategories = [
  "Music",
  "Business & Professional",
  "Food & Drink",
  "Community & Culture",
  "Performing & Visual Arts",
  "Film, Media & Entertainment",
  "Sports & Fitness",
  "Health & Wellness",
  "Science & Technology",
  "Travel & Outdoor",
  "Charity & Causes",
  "Religion & Spirituality",
  "Family & Education",
  "Seasonal & Holiday",
  "Government & Politics",
  "Fashion & Beauty",
  "Home & Lifestyle",
  "Auto, Boat & Air",
  "Hobbies & Special Interest",
  "School Activities",
  "Other"
];


export const prefectures = [
  "Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima",
  "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa",
  "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu",
  "Shizuoka", "Aichi", "Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara",
  "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi",
  "Tokushima", "Kagawa", "Ehime", "Kochi", "Fukuoka", "Saga", "Nagasaki",
  "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Okinawa"
];
