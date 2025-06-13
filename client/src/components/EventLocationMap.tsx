
type Props = {
  lat: number;
  lng: number;
  mapSrc: string;
};

export default function EventLocationMap({ lat, lng, mapSrc }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-blue-700">Location</h2>
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm px-4 flex items-center gap-2 shadow font-semibold text-base"
          title="Open map in full screen"
          style={{ minHeight: "2.5rem" }}
        >
          <svg
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            className="inline-block"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3m8-18h3a2 2 0 0 1 2 2v3m0 8v3a2 2 0 0 1-2 2h-3" />
          </svg>
          Open in Fullscreen
        </a>
      </div>
      <div className="mt-4 flex items-center justify-center text-blue-500 text-xs bg-blue-50 border border-blue-100 rounded h-64 overflow-hidden">
        <iframe
          title="Event Location Map"
          src={mapSrc}
          width="100%"
          height="220"
          className="rounded"
          style={{ border: 0, minWidth: "200px" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}