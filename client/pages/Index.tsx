import { useState } from "react";
import { CheckSquare, StickyNote } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { CircularTimer } from "../components/CircularTimer";
import { MotivationalQuotes } from "../components/MotivationalQuotes";
import { TodoPanel } from "../components/TodoPanel";
import { NotesPanel } from "../components/NotesPanel";
import { MusicControls } from "../components/MusicControls";

export default function Index() {
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_70%)]" />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Motivational Quotes */}
      <MotivationalQuotes />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-32">
        {/* App Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-focus-primary to-focus-secondary bg-clip-text text-transparent mb-2">
            Focus Space
          </h1>
          <p className="text-muted-foreground">
            Your productivity companion for distraction-free studying
          </p>
        </div>

        {/* Central Timer */}
        <CircularTimer isPlaying={isMusicPlaying} />

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-12">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsTodoOpen(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-card border border-border hover:border-focus-primary transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer z-10"
          >
            <CheckSquare className="h-5 w-5 text-focus-primary" />
            <span className="font-medium">To-Do</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsNotesOpen(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-card border border-border hover:border-focus-primary transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer z-10"
          >
            <StickyNote className="h-5 w-5 text-focus-accent" />
            <span className="font-medium">Notes</span>
          </button>
        </div>
      </div>

      {/* Music Controls */}
      <MusicControls
        isPlaying={isMusicPlaying}
        onPlayingChange={setIsMusicPlaying}
      />

      {/* Floating Panels */}
      <TodoPanel isOpen={isTodoOpen} onClose={() => setIsTodoOpen(false)} />
      <NotesPanel isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />

      {/* Mobile-friendly adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .text-4xl {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
