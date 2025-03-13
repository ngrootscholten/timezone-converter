"use client"

import { useState, useEffect, useRef } from "react"
import { Clock, Plus, Check, ChevronsUpDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimeZoneCard } from "@/components/time-zone-card"
import { cn } from "@/lib/utils"
import { cities } from "@/lib/cities"

export default function TimeZoneConverter() {
  const [userTimeZone, setUserTimeZone] = useState("")
  const [selectedTimeZones, setSelectedTimeZones] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [newTimeZone, setNewTimeZone] = useState("")
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Detect user's time zone on component mount
  useEffect(() => {
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTimeZone(detectedTimeZone)

    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Focus the input when the popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      // Small timeout to ensure the popover is fully rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 10)
    }
  }, [open])

  const addTimeZone = () => {
    if (newTimeZone && !selectedTimeZones.includes(newTimeZone)) {
      setSelectedTimeZones([...selectedTimeZones, newTimeZone])
      setNewTimeZone("")
      setSearchTerm("")
    }
  }

  const removeTimeZone = (timeZone: string) => {
    setSelectedTimeZones(selectedTimeZones.filter((tz) => tz !== timeZone))
  }

  // Filter cities based on search term
  const filteredCities = searchTerm
    ? cities.filter(
        (city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.country.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : cities

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Time Zone Converter
          </CardTitle>
          <CardDescription>See what time it is in different time zones relative to your local time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="w-full md:w-auto flex-1">
              <label className="block text-sm font-medium mb-2">Add a location</label>
              <Popover
                open={open}
                onOpenChange={(isOpen) => {
                  setOpen(isOpen)
                  if (!isOpen) {
                    setSearchTerm("")
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    onClick={() => setOpen(true)}
                  >
                    {newTimeZone
                      ? cities.find((city) => city.timeZone === newTimeZone)?.name
                      : "Search for a location..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      ref={inputRef}
                      placeholder="Search city, country, or US state..."
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                      autoFocus
                    />
                    <CommandList>
                      <CommandEmpty>No location found.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-y-auto">
                        {filteredCities.map((city) => (
                          <CommandItem
                            key={`${city.name}-${city.timeZone}`}
                            value={`${city.name} ${city.country}`}
                            onSelect={() => {
                              setNewTimeZone(city.timeZone)
                              setOpen(false)
                            }}
                            disabled={selectedTimeZones.includes(city.timeZone)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                newTimeZone === city.timeZone ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {city.name} {city.country !== "Single Time Zone" && `(${city.country})`}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={addTimeZone} disabled={!newTimeZone}>
              <Plus className="mr-2 h-4 w-4" />
              Add Time Zone
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User's current time zone */}
        <TimeZoneCard timeZone={userTimeZone} currentTime={currentTime} isUserTimeZone={true} />

        {/* Selected time zones */}
        {selectedTimeZones.map((timeZone) => (
          <TimeZoneCard
            key={timeZone}
            timeZone={timeZone}
            currentTime={currentTime}
            isUserTimeZone={false}
            onRemove={() => removeTimeZone(timeZone)}
          />
        ))}
      </div>

      {selectedTimeZones.length === 0 && (
        <div className="text-center mt-8 p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Add time zones to see what time it is in different locations</p>
        </div>
      )}
    </div>
  )
}

