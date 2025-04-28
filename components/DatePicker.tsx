"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

export function DatePickerDemo({ currentDate, setCurrentDate }: { currentDate: Date, setCurrentDate: (date: Date) => void }) {
  const [date, setDate] = React.useState<Date>(currentDate)

  React.useEffect(() => {
    setDate(currentDate)
  }, [currentDate])
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "max-w-[240px] justify-start text-left font-normal",
            "justify-between",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "MMMM yyyy") : <span>Pick a date</span>}
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={currentDate}
          onSelect={(day) => {
            if (day) {
              setDate(day)
              setCurrentDate(day)
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
