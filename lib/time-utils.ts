import { cities } from "./cities"

export function formatTimeZoneLabel(timeZone: string): string {
  // Find the city name from the time zone
  const city = cities.find((city) => city.timeZone === timeZone)
  if (city) {
    if (city.country === "Single Time Zone") {
      return city.name
    }
    return `${city.name}, ${city.country}`
  }

  // Fallback to extracting from the time zone string
  const parts = timeZone.split("/")
  return parts[parts.length - 1].replace(/_/g, " ")
}

export function getTimeDifference(userTimeZone: string, targetTimeZone: string): string {
  const now = new Date()

  // Get offset in minutes for both time zones
  const userOffset = getTimezoneOffset(now, userTimeZone)
  const targetOffset = getTimezoneOffset(now, targetTimeZone)

  // Calculate the difference in hours
  const diffInMinutes = targetOffset - userOffset
  const diffInHours = diffInMinutes / 60

  // Format the difference
  if (diffInHours === 0) {
    return "Same time"
  } else if (diffInHours > 0) {
    return `${Math.abs(diffInHours)} hour${Math.abs(diffInHours) !== 1 ? "s" : ""} ahead`
  } else {
    return `${Math.abs(diffInHours)} hour${Math.abs(diffInHours) !== 1 ? "s" : ""} behind`
  }
}

function getTimezoneOffset(date: Date, timeZone: string): number {
  // Create formatter for the target timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })

  // Format the date in the target timezone
  const formattedParts = formatter.formatToParts(date)

  // Extract hour and minute
  const hour = Number.parseInt(formattedParts.find((part) => part.type === "hour")?.value || "0")
  const minute = Number.parseInt(formattedParts.find((part) => part.type === "minute")?.value || "0")
  const dayPeriod = formattedParts.find((part) => part.type === "dayPeriod")?.value

  // Convert to 24-hour format if needed
  let hour24 = hour
  if (dayPeriod === "PM" && hour !== 12) {
    hour24 += 12
  } else if (dayPeriod === "AM" && hour === 12) {
    hour24 = 0
  }

  // Calculate minutes since midnight
  return hour24 * 60 + minute
}

