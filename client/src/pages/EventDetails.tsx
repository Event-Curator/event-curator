import { useParams } from "react-router";

export default function EventDetails() {
  const { id } = useParams();

  return (
    <>
      <h1 className="text-3xl font-bold">Event Details</h1>
      <p>Details for event {id}.</p>
    </>
  );
}
