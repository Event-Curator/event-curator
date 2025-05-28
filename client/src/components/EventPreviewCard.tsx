import { Link } from "react-router";

interface EventPreviewCardProps {
  name: string;
  location: string;
  date: string;
  link: string;
}

export default function EventPreviewCard({
  name,
  location,
  date,
  link,
}: EventPreviewCardProps) {
  return (
    <div className="card w-96 bg-base-100 card-md shadow-sm">
      <div className="card-body">
        <h2 className="text-2xl underline">{name}</h2>
        <p className="text-xl flex flex-row gap-2">
          <span className="font-bold">Where:</span>
          {location}
        </p>
        <p className="text-xl flex flex-row gap-2">
          <span className="font-bold">When:</span>
          {date}
        </p>
        <div className="justify-end card-actions">
          <Link to={link}>
            <button className="btn btn-primary">Learn More</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
