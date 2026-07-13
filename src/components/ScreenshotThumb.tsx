import { useEffect, useState } from "react";

export function ScreenshotThumb({ blob, onRemove }: { blob: Blob; onRemove?: () => void }) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  if (!url) return null;

  return (
    <div className="thumb">
      <img src={url} alt="Screenshot" />
      {onRemove && (
        <button type="button" className="thumb-remove" onClick={onRemove} aria-label="Screenshot entfernen">
          ×
        </button>
      )}
    </div>
  );
}
