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
}

const generateTimeSlots = (startDate: Date, days: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  for (let day = 0; day < days; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);

    for (const hour of hours) {
      slots.push({
        date: new Date(date),
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

export default function EventForm({ documentTitle, onSubmit }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return generateTimeSlots(today, 7);
  });

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

  const groupedSlots = timeSlots.reduce((acc, slot, index) => {
    const dateKey = slot.date.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push({ ...slot, index });
    return acc;
  }, {} as Record<string, Array<TimeSlot & { index: number }>>);

  const dates = Object.keys(groupedSlots).sort();

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Create Event</CardTitle>
        <CardDescription>Document: {documentTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            />
          </div>

          <div className="space-y-4">
            <Label>Select Available Time Slots</Label>
            <div className="overflow-x-auto p-4 bg-white rounded-lg border">
              <div className="min-w-max">
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `120px repeat(${dates.length}, minmax(100px, 1fr))`,
                  }}
                >
                  <div className="p-2 text-sm font-semibold text-muted-foreground">
                    Time
                  </div>
                  {dates.map((dateKey) => {
                    const date = new Date(dateKey);
                    return (
                      <div
                        key={dateKey}
                        className="p-2 text-sm font-semibold text-center border-b"
                      >
                        {formatDate(date)}
                      </div>
                    );
                  })}

                  {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((hour) => (
                    <div key={hour} className="contents">
                      <div className="p-2 text-sm border-r text-muted-foreground">
                        {formatTime(hour)}
                      </div>
                      {dates.map((dateKey) => {
                        const slot = groupedSlots[dateKey].find(
                          (s) => s.hour === hour
                        );
                        if (!slot)
                          return (
                            <div key={`${dateKey}-${hour}`} className="p-2" />
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
                                  ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
                                  : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                              }
                            `}
                          >
                            <span className={slot.selected ? "" : "invisible"}>
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
  );
}
