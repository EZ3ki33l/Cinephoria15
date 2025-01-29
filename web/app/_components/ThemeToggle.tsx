import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Basculer le thème"
      className="relative overflow-hidden"
    >
      <div className="relative h-5 w-5">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: theme === "light" ? 1 : 0,
            rotate: 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Sun className="h-5 w-5 text-primary dark:text-primary-light" />
        </motion.div>
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{
            scale: theme === "dark" ? 1 : 0,
            rotate: 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Moon className="h-5 w-5 text-primary dark:text-primary-light" />
        </motion.div>
      </div>
    </Button>
  );
} 