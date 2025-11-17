"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import useMounted from "@/hooks/use-mounted";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = theme === "dark";

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-transparent"
        disabled
      >
        <Sun className="h-4 w-4 text-foreground transition-all" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 hover:bg-transparent"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-foreground transition-all" />
      ) : (
        <Sun className="h-4 w-4 text-foreground transition-all" />
      )}
    </Button>
  );
}