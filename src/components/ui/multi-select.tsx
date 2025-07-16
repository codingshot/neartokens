
import * as React from "react"
import { Check, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MultiSelectProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: string) => {
    onChange(selected.filter((s) => s !== item))
  }

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item))
    } else {
      onChange([...selected, item])
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between min-w-[100px] sm:min-w-[200px] w-full"
          >
            {selected.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selected.slice(0, 1).map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="text-xs max-w-[80px] truncate"
                  >
                    {item}
                  </Badge>
                ))}
                {selected.length > 1 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selected.length - 1}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] sm:w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search backers..." />
            <CommandList>
              <CommandEmpty>No backers found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
