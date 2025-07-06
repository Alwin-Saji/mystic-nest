import { useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw, Settings, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CircularTimerProps {
  isPlaying: boolean;
}

export function CircularTimer({ isPlaying }: CircularTimerProps) {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [waveforms, setWaveforms] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [breakReminder, setBreakReminder] = useState(60); // in minutes
  const [lastBreakTime, setLastBreakTime] = useState(Date.now());
  const [showBreakNotification, setShowBreakNotification] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const waveformRef = useRef<NodeJS.Timeout>();
  const breakCheckRef = useRef<NodeJS.Timeout>();

  // Generate waveform data
  useEffect(() => {
    if (isPlaying && isRunning) {
      waveformRef.current = setInterval(() => {
        const newWaveforms = Array.from(
          { length: 32 },
          () => Math.random() * 0.8 + 0.2,
        );
        setWaveforms(newWaveforms);
      }, 100);
    } else {
      clearInterval(waveformRef.current);
      setWaveforms(Array.from({ length: 32 }, () => 0.1));
    }

    return () => clearInterval(waveformRef.current);
  }, [isPlaying, isRunning]);

  // Timer countdown
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Timer completed - show notification
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("Focus Timer Complete!", {
                body: "Great job! Time for a break.",
                icon: "/favicon.ico",
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, time]);

  // Break reminder check
  useEffect(() => {
    if (isRunning) {
      breakCheckRef.current = setInterval(() => {
        const now = Date.now();
        const timeSinceLastBreak = (now - lastBreakTime) / (1000 * 60); // in minutes

        if (timeSinceLastBreak >= breakReminder) {
          setShowBreakNotification(true);
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("Break Reminder", {
              body: `You've been focused for ${breakReminder} minutes. Time for a break!`,
              icon: "/favicon.ico",
            });
          }
        }
      }, 60000); // Check every minute
    } else {
      clearInterval(breakCheckRef.current);
    }

    return () => clearInterval(breakCheckRef.current);
  }, [isRunning, breakReminder, lastBreakTime]);

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const progress = (initialTime - time) / initialTime;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSetTimer = (minutes: number) => {
    console.log("Setting timer to:", minutes, "minutes");
    if (!isRunning) {
      const newTime = minutes * 60;
      setTime(newTime);
      setInitialTime(newTime);
      console.log("Timer set successfully");
    } else {
      console.log("Timer is running, cannot set new time");
    }
  };

  const handleCustomTimer = () => {
    console.log("Setting custom timer:", customMinutes, "minutes");
    if (!isRunning && customMinutes > 0 && customMinutes <= 120) {
      const newTime = customMinutes * 60;
      setTime(newTime);
      setInitialTime(newTime);
      setShowSettings(false);
      console.log("Custom timer set successfully");
    } else {
      console.log("Cannot set custom timer:", { isRunning, customMinutes });
    }
  };

  const handleToggleSettings = () => {
    console.log("Toggling settings:", !showSettings);
    setShowSettings(!showSettings);
  };

  const handleCloseSettings = () => {
    console.log("Closing settings");
    setShowSettings(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(initialTime);
  };

  const takeBreak = () => {
    setLastBreakTime(Date.now());
    setShowBreakNotification(false);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Break Notification */}
      <AnimatePresence>
        {showBreakNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-focus-warm text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-3"
          >
            <Coffee className="h-5 w-5" />
            <span className="font-medium">Time for a break!</span>
            <button
              onClick={takeBreak}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm transition-colors"
            >
              Take Break
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Buttons */}
      <div
        className="flex flex-wrap justify-center gap-3 relative z-20"
        style={{ pointerEvents: "auto" }}
      >
        <button
          onClick={() => handleSetTimer(25)}
          onMouseDown={(e) => {
            console.log("25min button mousedown");
            e.preventDefault();
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative z-30 cursor-pointer ${
            initialTime === 1500 && !isRunning
              ? "bg-focus-primary text-white shadow-lg"
              : "bg-card border border-border hover:border-focus-primary"
          }`}
          disabled={isRunning}
          style={{ pointerEvents: "auto" }}
        >
          25min
        </button>
        <button
          onClick={() => handleSetTimer(50)}
          onMouseDown={(e) => {
            console.log("50min button mousedown");
            e.preventDefault();
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative z-30 cursor-pointer ${
            initialTime === 3000 && !isRunning
              ? "bg-focus-primary text-white shadow-lg"
              : "bg-card border border-border hover:border-focus-primary"
          }`}
          disabled={isRunning}
          style={{ pointerEvents: "auto" }}
        >
          50min
        </button>
        <button
          onClick={handleToggleSettings}
          onMouseDown={(e) => {
            console.log("Custom button mousedown");
            e.preventDefault();
          }}
          className="px-4 py-2 rounded-full text-sm font-medium bg-card border border-border hover:border-focus-primary transition-all duration-300 flex items-center space-x-2 relative z-30 cursor-pointer"
          disabled={isRunning}
          style={{ pointerEvents: "auto" }}
        >
          <Settings className="h-4 w-4" />
          <span>Custom</span>
        </button>
      </div>

      {/* Custom Timer Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card border border-border rounded-lg p-6 shadow-lg space-y-4 relative z-50"
            style={{ pointerEvents: "auto" }}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Custom Timer (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customMinutes}
                  onChange={(e) => {
                    console.log(
                      "Custom minutes input changed:",
                      e.target.value,
                    );
                    setCustomMinutes(Number(e.target.value));
                  }}
                  onFocus={() => console.log("Custom minutes input focused")}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-focus-primary relative z-50"
                  style={{ pointerEvents: "auto" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Break Reminder (minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  value={breakReminder}
                  onChange={(e) => {
                    console.log(
                      "Break reminder input changed:",
                      e.target.value,
                    );
                    setBreakReminder(Number(e.target.value));
                  }}
                  onFocus={() => console.log("Break reminder input focused")}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-focus-primary relative z-50"
                  style={{ pointerEvents: "auto" }}
                />
              </div>
            </div>
            <div className="flex space-x-3 relative z-50">
              <button
                onClick={(e) => {
                  console.log("Set Timer button clicked");
                  e.preventDefault();
                  e.stopPropagation();
                  handleCustomTimer();
                }}
                onMouseDown={() => console.log("Set Timer button mousedown")}
                className="flex-1 bg-focus-primary text-white py-2 px-4 rounded-md hover:bg-focus-primary/90 transition-colors cursor-pointer relative z-50"
                style={{ pointerEvents: "auto" }}
              >
                Set Timer
              </button>
              <button
                onClick={(e) => {
                  console.log("Cancel button clicked");
                  e.preventDefault();
                  e.stopPropagation();
                  handleCloseSettings();
                }}
                onMouseDown={() => console.log("Cancel button mousedown")}
                className="flex-1 bg-card border border-border py-2 px-4 rounded-md hover:border-focus-primary transition-colors cursor-pointer relative z-50"
                style={{ pointerEvents: "auto" }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular Timer */}
      <div className="relative">
        {/* Waveform Animation Around Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-80 h-80">
            {waveforms.map((height, index) => {
              const angle = (index * 360) / waveforms.length;
              const radius = 140 + height * 30; // Base radius + dynamic height
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.div
                  key={index}
                  className="absolute bg-focus-waveform rounded-full opacity-70"
                  style={{
                    width: "4px",
                    height: "4px",
                    left: "50%",
                    top: "50%",
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  animate={{
                    transform: `translate(${x}px, ${y}px) scale(${0.5 + height})`,
                    opacity: 0.4 + height * 0.4,
                  }}
                  transition={{
                    duration: 0.1,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Timer Circle */}
        <svg
          className="w-64 h-64 transform -rotate-90 relative z-10"
          viewBox="0 0 256 256"
        >
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-border opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-focus-timer"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: "drop-shadow(0 0 12px hsl(var(--focus-timer)))",
              transition: "stroke-dashoffset 1s ease-in-out",
            }}
          />
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="text-4xl font-mono font-bold text-foreground mb-4">
            {formatTime(time)}
          </div>
          <div className="flex space-x-3 relative z-20">
            <button
              onClick={() => setIsRunning(!isRunning)}
              onMouseDown={(e) => {
                console.log("Play/Pause button mousedown");
                e.preventDefault();
              }}
              className="p-3 rounded-full bg-focus-primary text-white hover:bg-focus-primary/90 transition-all duration-300 hover:scale-105 shadow-lg relative z-30 cursor-pointer"
              style={{ pointerEvents: "auto" }}
            >
              {isRunning ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={resetTimer}
              onMouseDown={(e) => {
                console.log("Reset button mousedown");
                e.preventDefault();
              }}
              className="p-3 rounded-full bg-card border border-border hover:border-focus-primary transition-all duration-300 hover:scale-105 relative z-30 cursor-pointer"
              style={{ pointerEvents: "auto" }}
            >
              <RotateCcw className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
