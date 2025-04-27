import { useEffect, useRef, useState } from "react";

interface VideoStreamProps {
  stream: MediaStream | null;
  isLocal?: boolean;
}

const VideoStream: React.FC<VideoStreamProps> = ({ stream, isLocal = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleError = (e: ErrorEvent) => {
      console.error('Video error:', e);
      setError('Error playing video stream');
    };

    const handleLoadedMetadata = () => {
      setError(null);
      console.log('Video stream loaded successfully');
    };

    video.addEventListener('error', handleError);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    if (stream) {
      video.srcObject = stream;
      video.muted = isLocal;
      video.play().catch(err => {
        console.error('Error playing video:', err);
        setError('Error playing video stream');
      });
    }

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (video.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [stream, isLocal]);

  return (
    <div className="relative w-64 h-48 border rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
          <span className="text-white text-sm">{error}</span>
        </div>
      )}
      <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
        {isLocal ? "You" : "Remote"}
      </span>
    </div>
  );
};

export default VideoStream;
