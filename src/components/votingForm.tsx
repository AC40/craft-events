import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { ParsedTable } from "@/lib/tableParser";

interface VotingFormProps {
  table: ParsedTable;
  timeSlots: Array<{ date: Date; hour: number }>;
  onSubmit: (name: string, votes: Record<number, boolean>) => Promise<void>;
}

export default function VotingForm({
  table,
  timeSlots,
  onSubmit,
}: VotingFormProps) {
  const [name, setName] = useState("");
  const [votes, setVotes] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleVote = (slotIndex: number) => {
    setVotes((prev) => ({
      ...prev,
      [slotIndex]: !prev[slotIndex],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), votes);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vote on Availability</CardTitle>
        <CardDescription>
          Select the time slots you're available for
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Select Available Time Slots</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleVote(index)}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-left min-h-[100px] flex flex-col justify-between
                    ${
                      votes[index]
                        ? "bg-blue-50 border-blue-500"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <div>
                    <div className="font-medium">{formatDate(slot.date)}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(slot.hour)}
                    </div>
                  </div>
                  <div
                    className={`mt-2 font-bold text-blue-600 ${votes[index] ? "" : "invisible"}`}
                  >
                    ✓ Available
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Vote"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
