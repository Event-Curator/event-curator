import React, { useState } from "react";
import ShareIcon from "../svgs/ShareIcon";

export default function ShareTimeline({ timelineId }: { timelineId: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/timeline/${timelineId}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm rounded-md flex items-center gap-2"
        title="Share timeline"
        onClick={e => {
          e.stopPropagation();
          setOpen(true);
        }}
        style={{ lineHeight: 0 }}
      >
        <ShareIcon width={20} height={20} />
        Share
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div
            className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 min-w-[260px] relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={e => {
                e.stopPropagation();
                setOpen(false);
                setCopied(false);
              }}
              aria-label="Close"
            >
              ×
            </button>
            <button
              className="bg-blue-50 rounded-full p-2 hover:bg-blue-100"
              onClick={handleCopy}
              title="Copy link"
              style={{ lineHeight: 0 }}
            >
              <ShareIcon width={32} height={32} />
            </button>
            <div>
              <div className="font-bold text-blue-700 mb-1">Share your timeline</div>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleCopy}
                style={{ minWidth: 100 }}
              >
                Copy link
              </button>
              {copied && (
                <div className="text-green-600 text-xs mt-2">Link copied!</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}