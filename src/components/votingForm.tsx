import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import ConfirmDialog from "./confirmDialog";
import { MAX_LENGTHS } from "@/lib/sanitize";
import type { ParsedTable } from "@/lib/tableParser";
import {
  formatDateInTimezone,
  formatTimeInTimezone,
  getLocalTimeString,
} from "@/lib/tableParser";

const MotionButton = motion.create(Button);

interface VotingFormProps {
  table: ParsedTable;
  timeSlots: Array<{ date: Date; hour: number }>;
  timezone?: string | null;
  onSubmit: (name: string, votes: Record<number, boolean>) => Promise<void>;
  onBack?: () => void;
}

export default function VotingForm({
  table,
  timeSlots,
  timezone,
  onSubmit,
  onBack,
}: VotingFormProps) {
  const [name, setName] = useState("");
  const [votes, setVotes] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAbortDialog, setShowAbortDialog] = useState(false);

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

  const hasUnsavedChanges = () => {
    return name.trim() !== "" || Object.keys(votes).length > 0;
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
    setName("");
    setVotes({});
    onBack?.();
  };

  const formatDate = (date: Date): string => {
    return formatDateInTimezone(date, timezone);
  };

  const formatTime = (date: Date): string => {
    const timeStr = formatTimeInTimezone(date, timezone);
    const localTime = getLocalTimeString(date, timezone);
    if (localTime) {
      return `${timeStr} (${localTime} your time)`;
    }
    return timeStr;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Vote on Availability</CardTitle>
          <CardDescription>
            Select the time slots you're available for
          </CardDescription>
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
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={MAX_LENGTHS.participantName}
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Select Available Time Slots</Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {timeSlots.map((slot, index) => (
                  <motion.button
                    key={slot.date.toISOString()}
                    type="button"
                    onClick={() => toggleVote(index)}
                    whileTap={{ scale: 0.97 }}
                    className={`
                    p-4 rounded-lg border-2 transition-all text-left min-h-[100px] flex flex-col justify-between
                    ${
                      votes[index]
                        ? "bg-accent/20 border-accent"
                        : "bg-card border-border hover:border-accent/50"
                    }
                  `}
                  >
                    <div>
                      <div className="font-medium">{formatDate(slot.date)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(slot.date)}
                      </div>
                    </div>
                    <AnimatePresence>
                      {votes[index] && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          className="mt-2 font-bold text-accent"
                        >
                          ✓ Available
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {!votes[index] && (
                      <div className="mt-2 invisible font-bold">
                        ✓ Available
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <MotionButton
              type="submit"
              className="w-full"
              disabled={isSubmitting || !name.trim()}
              whileTap={{ scale: 0.97 }}
            >
              {isSubmitting ? "Submitting..." : "Submit Vote"}
            </MotionButton>
          </form>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={showAbortDialog}
        title="Discard unsaved votes?"
        description="You have unsaved votes. Are you sure you want to go back? Your selections will be lost."
        confirmLabel="Discard"
        cancelLabel="Cancel"
        onConfirm={handleAbortConfirm}
        onCancel={() => setShowAbortDialog(false)}
      />
    </>
  );
}
