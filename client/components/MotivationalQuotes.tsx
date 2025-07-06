import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "The future depends on what you do today.",
  "Focus on progress, not perfection.",
  "Success is the sum of small efforts repeated daily.",
  "You are capable of amazing things.",
  "Don't watch the clock; do what it does. Keep going.",
  "Great things never come from comfort zones.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
];

export function MotivationalQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 180000); // Change every 3 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-6 left-6 max-w-sm z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg"
        >
          <p className="text-sm text-muted-foreground italic">
            "{quotes[currentQuote]}"
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
