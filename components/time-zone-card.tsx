"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatTimeZoneLabel, getTimeDifference } from "@/lib/time-utils"

interface TimeZoneCardProps {
  timeZone: string
  currentTime: Date
  isUserTimeZone: boolean
  onRemove?: () => void
}

export function TimeZoneCard({ timeZone, currentTime, isUserTimeZone, onRemove }: TimeZoneCardProps) {
  const [localTime, setLocalTime] = useState("")
  const [date, setDate] = useState("")
  const [timeDiff, setTimeDiff] = useState("")

  useEffect(() => {
    if (!timeZone) return

    try {
      // Format the time in the specified time zone
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: timeZone,
      })

      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: timeZone,
      })

      setLocalTime(formatter.format(currentTime))
      setDate(dateFormatter.format(currentTime))

      // Calculate time difference if not user's time zone
      if (!isUserTimeZone) {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        setTimeDiff(getTimeDifference(userTimeZone, timeZone))
      }
    } catch (error) {
      console.error("Error formatting time for time zone:", timeZone, error)
    }
  }, [timeZone, currentTime, isUserTimeZone])

  return (
    <Card className={isUserTimeZone ? "border-primary" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">
          {formatTimeZoneLabel(timeZone)}
          {isUserTimeZone && <Badge className="ml-2">Your time zone</Badge>}
        </CardTitle>
        {!isUserTimeZone && onRemove && (
          <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{localTime}</div>
        <div className="text-sm text-muted-foreground mt-1">{date}</div>

        {!isUserTimeZone && timeDiff && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {timeDiff}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

