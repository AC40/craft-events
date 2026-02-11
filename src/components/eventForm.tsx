import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import ConfirmDialog from "./confirmDialog";
import { MAX_LENGTHS } from "@/lib/sanitize";

export interface TimeSlot {
  date: Date;
  hour: number;
  selected: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  timeSlots: TimeSlot[];
}

interface EventFormProps {
  documentTitle: string;
  onSubmit?: (data: EventFormData) => void;
  onBack?: () => void;
}

const generateTimeSlots = (
  startDate: Date,
  days: number,
  timezone?: string
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Helper to create a date in the specified timezone
  const createDateInTimezone = (
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    tz: string
  ): Date => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const baseUtc = Date.UTC(year, month, day, hour, minute);
    const searchWindow = 16 * 60 * 60 * 1000;
    let low = baseUtc - searchWindow;
    let high = baseUtc + searchWindow;

    for (let i = 0; i < 30; i++) {
      const mid = Math.floor((low + high) / 2);
      const testDate = new Date(mid);
      const parts = formatter.formatToParts(testDate);

      const tzYear = parseInt(
        parts.find((p) => p.type === "year")?.value || "0",
        10
      );
      const tzMonth =
        parseInt(parts.find((p) => p.type === "month")?.value || "0", 10) - 1;
      const tzDay = parseInt(
        parts.find((p) => p.type === "day")?.value || "0",
        10
      );
      const tzHour = parseInt(
        parts.find((p) => p.type === "hour")?.value || "0",
        10
      );
      const tzMinute = parseInt(
        parts.find((p) => p.type === "minute")?.value || "0",
        10
      );

      if (
        tzYear === year &&
        tzMonth === month &&
        tzDay === day &&
        tzHour === hour &&
        tzMinute === minute
      ) {
        return testDate;
      }

      const targetValue =
        year * 100000000 + month * 1000000 + day * 10000 + hour * 100 + minute;
      const currentValue =
        tzYear * 100000000 +
        tzMonth * 1000000 +
        tzDay * 10000 +
        tzHour * 100 +
        tzMinute;

      if (currentValue < targetValue) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }

      if (low >= high) break;
    }

    return new Date(Math.floor((low + high) / 2));
  };

  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();

  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dayOfMonth = currentDate.getDate();

    for (const hour of hours) {
      // Create date object representing this moment in the creator's timezone
      const slotDate = createDateInTimezone(
        year,
        month,
        dayOfMonth,
        hour,
        0,
        tz
      );

      slots.push({
        date: slotDate,
        hour,
        selected: false,
      });
    }
  }

  return slots;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (hour: number): string => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${period}`;
};

export default function EventForm({
  documentTitle,
  onSubmit,
  onBack,
}: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Format as YYYY-MM-DD in local timezone (not UTC)
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [endDate, setEndDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setHours(0, 0, 0, 0);
    nextWeek.setDate(nextWeek.getDate() + 6);
    // Format as YYYY-MM-DD in local timezone (not UTC)
    const year = nextWeek.getFullYear();
    const month = String(nextWeek.getMonth() + 1).padStart(2, "0");
    const day = String(nextWeek.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 6);
    const daysDiff =
      Math.ceil(
        (nextWeek.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    // Get creator's timezone (may be overridden by tester)
    const creatorTimezone =
      typeof window !== "undefined"
        ? (() => {
            try {
              const { getCurrentTimezone } = require("@/lib/timezoneUtils");
              return getCurrentTimezone();
            } catch {
              return Intl.DateTimeFormat().resolvedOptions().timeZone;
            }
          })()
        : "UTC";
    return generateTimeSlots(today, daysDiff, creatorTimezone);
  });
  const [showAbortDialog, setShowAbortDialog] = useState(false);

  const updateTimeSlots = (start: string, end: string) => {
    const startDateObj = new Date(start);
    startDateObj.setHours(0, 0, 0, 0);
    const endDateObj = new Date(end);
    endDateObj.setHours(0, 0, 0, 0);

    if (endDateObj < startDateObj) {
      return;
    }

    const daysDiff =
      Math.ceil(
        (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    // Get creator's timezone (may be overridden by tester)
    const creatorTimezone =
      typeof window !== "undefined"
        ? (() => {
            try {
              const { getCurrentTimezone } = require("@/lib/timezoneUtils");
              return getCurrentTimezone();
            } catch {
              return Intl.DateTimeFormat().resolvedOptions().timeZone;
            }
          })()
        : "UTC";

    const newSlots = generateTimeSlots(startDateObj, daysDiff, creatorTimezone);

    setTimeSlots((prev) => {
      const selectedSlots = new Map<string, boolean>();
      prev.forEach((slot) => {
        const key = `${slot.date.toDateString()}-${slot.hour}`;
        selectedSlots.set(key, slot.selected);
      });

      return newSlots.map((slot) => {
        const key = `${slot.date.toDateString()}-${slot.hour}`;
        return {
          ...slot,
          selected: selectedSlots.get(key) || false,
        };
      });
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    updateTimeSlots(newStart, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setEndDate(newEnd);
    updateTimeSlots(startDate, newEnd);
  };

  const toggleTimeSlot = (index: number) => {
    setTimeSlots((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        selected: !updated[index].selected,
      };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      title,
      description,
      location,
      timeSlots: timeSlots.filter((slot) => slot.selected),
    });
  };

  const hasUnsavedChanges = () => {
    return (
      title.trim() !== "" ||
      description.trim() !== "" ||
      location.trim() !== "" ||
      timeSlots.some((slot) => slot.selected)
    );
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges()) {
      setShowAbortDialog(true);
    } else {
      onBack?.();
    }
  };

  const handleAbortConfirm = () => {
    setShowAbortDialog(false);
    onBack?.();
  };

  const groupedSlots = timeSlots.reduce((acc, slot, index) => {
    const dateKey = slot.date.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push({ ...slot, index });
    return acc;
  }, {} as Record<string, Array<TimeSlot & { index: number }>>);

  // Sort dates chronologically by converting back to Date objects
  const dates = Object.keys(groupedSlots).sort((a, b) => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    return dateA - dateB;
  });

  return (
    <>
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription>Document: {documentTitle}</CardDescription>
        </CardHeader>
        <CardContent>
          {onBack && (
            <div className="mb-4">
              <Button variant="ghost" onClick={handleBackClick}>
                ← Back
              </Button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={MAX_LENGTHS.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Enter event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={MAX_LENGTHS.description}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter event location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={MAX_LENGTHS.location}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <Label>Date Range</Label>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      min={(() => {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const day = String(today.getDate()).padStart(2, "0");
                        return `${year}-${month}-${day}`;
                      })()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      min={startDate}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Label>Select Available Time Slots</Label>
                <div className="overflow-auto p-4 bg-card rounded-lg border max-h-[600px]">
                  <div className="min-w-max">
                    <div
                      className="grid gap-0"
                      style={{
                        gridTemplateColumns: `120px repeat(${dates.length}, minmax(100px, 1fr))`,
                      }}
                    >
                      <div className="p-2 text-sm font-semibold text-muted-foreground sticky left-0 top-0 z-30 bg-card border-r border-b">
                        Time
                      </div>
                      {dates.map((dateKey) => {
                        const date = new Date(dateKey);
                        return (
                          <div
                            key={dateKey}
                            className="p-2 text-sm font-semibold text-center border-b sticky top-0 z-20 bg-card"
                          >
                            {formatDate(date)}
                          </div>
                        );
                      })}

                      {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                        <div key={hour} className="contents">
                          <div className="p-2 text-sm border-r text-muted-foreground sticky left-0 z-10 bg-card">
                            {formatTime(hour)}
                          </div>
                          {dates.map((dateKey) => {
                            const slot = groupedSlots[dateKey].find(
                              (s) => s.hour === hour
                            );
                            if (!slot)
                              return (
                                <div
                                  key={`${dateKey}-${hour}`}
                                  className="p-2"
                                />
                              );

                            return (
                              <button
                                key={`${dateKey}-${hour}`}
                                type="button"
                                onClick={() => toggleTimeSlot(slot.index)}
                                className={`
                              p-2 m-1 rounded border transition-colors min-h-[40px] flex items-center justify-center
                              ${
                                slot.selected
                                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                  : "bg-secondary hover:bg-secondary/80 border-border"
                              }
                            `}
                              >
                                <span
                                  className={slot.selected ? "" : "invisible"}
                                >
                                  ✓
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Click on time slots to mark them as available
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="submit"
                disabled={
                  !title || timeSlots.filter((s) => s.selected).length === 0
                }
              >
                Create Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={showAbortDialog}
        title="Discard unsaved changes?"
        description="You have unsaved changes. Are you sure you want to go back? All your input will be lost."
        confirmLabel="Discard"
        cancelLabel="Cancel"
        onConfirm={handleAbortConfirm}
        onCancel={() => setShowAbortDialog(false)}
      />
    </>
  );
}
