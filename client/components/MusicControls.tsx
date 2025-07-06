import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Upload,
} from "lucide-react";

interface MusicControlsProps {
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
}

const ambientTracks = [
  {
    name: "White Noise",
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhETW+gL2ufH",
  },
];

export function MusicControls({
  isPlaying,
  onPlayingChange,
}: MusicControlsProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [customFile, setCustomFile] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCurrentTrackUrl = () => {
    if (customFile) return customFile;
    return ambientTracks[currentTrack]?.url;
  };

  const getCurrentTrackName = () => {
    if (customFile) return "Custom Track";
    return ambientTracks[currentTrack]?.name || "No Track";
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
    audio.loop = true;

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch((error) => {
          console.warn("Audio playback failed:", error);
          onPlayingChange(false);
        });
      }
    };

    const handleError = () => {
      console.warn("Audio source failed to load");
      onPlayingChange(false);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    if (isPlaying && audio.readyState >= 2) {
      audio.play().catch((error) => {
        console.warn("Audio playback failed:", error);
        onPlayingChange(false);
      });
    } else if (!isPlaying) {
      audio.pause();
    }

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [isPlaying, volume, isMuted, currentTrack, customFile, onPlayingChange]);

  const togglePlay = () => {
    onPlayingChange(!isPlaying);
  };

  const nextTrack = () => {
    if (customFile) {
      setCustomFile(null);
    } else {
      setCurrentTrack((prev) => (prev + 1) % ambientTracks.length);
    }
  };

  const previousTrack = () => {
    if (customFile) {
      setCurrentTrack(ambientTracks.length - 1);
      setCustomFile(null);
    } else {
      setCurrentTrack(
        (prev) => (prev - 1 + ambientTracks.length) % ambientTracks.length,
      );
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file);
      setCustomFile(url);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={getCurrentTrackUrl()}
        preload="none"
        onError={() => console.warn("Audio load error")}
      />

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-2xl p-4">
          <div className="flex items-center space-x-4">
            {/* Track Info */}
            <div className="hidden sm:block min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {customFile ? "Custom Track" : "Upload Your Music"}
              </p>
              <p className="text-xs text-muted-foreground">
                {customFile ? "Personal Audio" : "Click upload to add tracks"}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={previousTrack}
                className="p-2 rounded-full hover:bg-accent transition-colors"
                title="Previous track"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-focus-primary text-white hover:bg-focus-primary/90 transition-all duration-300 hover:scale-105 shadow-lg"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 rounded-full hover:bg-accent transition-colors"
                title="Next track"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              <div className="w-px h-6 bg-border mx-2" />

              {/* Volume Control */}
              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-accent transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 accent-focus-primary"
                title="Volume"
              />

              {/* File Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-accent transition-colors"
                title="Upload custom track"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
