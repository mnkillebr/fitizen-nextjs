"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function MultiSelect({ options, label = "option" }: { options: { label: string; value: string }[], label?: string }) {
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = React.useState<string[]>([])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="multiselect"
          aria-expanded={open}
          className="flex items-center justify-between bg-background-muted border border-border-muted rounded-md px-2 py-1 min-h-[36px]"
        >
          <div className="flex items-center gap-1 flex-wrap text-xs">
            {values.length > 0
              ? values.map((value) => {
                const option = options.find((option) => option.value === value)
                return (
                  <div
                    key={value}
                    className="flex justify-between items-center text-xs rounded-full border border-border-muted bg-background px-2 py-1 gap-1"
                  >
                    {option?.label}
                    <XIcon
                      onClick={(e) => {
                        e.stopPropagation()
                        setValues(values.filter((v) => v !== value))
                      }}
                      className="h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                    />
                    <span className="sr-only">Close</span>
                  </div>
                )
              })
              : `Select ${label} ...`}
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const newValues = values.includes(currentValue) ? values.filter((value) => value !== currentValue) : [...values, currentValue]
                    setValues(newValues)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      values.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default MultiSelect;