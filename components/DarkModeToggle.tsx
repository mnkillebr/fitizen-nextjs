"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"


export function DarkModeToggle() {
  const { setTheme, theme, systemTheme } = useTheme()
  const toggleDarkMode = () => {
    if (theme === "system" && systemTheme) {
      systemTheme === "dark" ? setTheme("light") : setTheme("dark")
    } else {
      theme === "dark" ? setTheme("light") : setTheme("dark")
    }
  }
  return (
    <Button
      variant="outline"
      size="icon"
      className="hover:cursor-pointer"
      onClick={toggleDarkMode}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
