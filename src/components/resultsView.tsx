import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { ParsedTable } from '@/lib/tableParser';

interface ResultsViewProps {
  table: ParsedTable;
  timeSlots: Array<{ date: Date; hour: number }>;
}

export default function ResultsView({ table, timeSlots }: ResultsViewProps) {
  const formatDate = (date: Date): string => {
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    return `${month} ${day} ${weekday}`;
  };

  const formatTime = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const nextHour = hour + 1 > 12 ? (hour + 1 - 12) : hour + 1 === 0 ? 12 : hour + 1;
    const nextPeriod = hour + 1 >= 12 ? 'PM' : 'AM';
    return `${displayHour}:00 ${period} - ${nextHour}:00 ${nextPeriod}`;
  };

  const getParticipantCount = (slotIndex: number): number => {
    return table.rows.filter((row) => {
      const cellIndex = slotIndex + 1;
      return row.cells[cellIndex]?.value.trim() === '✅';
    }).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Scheduling Results</CardTitle>
        <CardDescription>Current availability status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid gap-2 mb-4 border-b pb-4" style={{ gridTemplateColumns: `200px repeat(${timeSlots.length}, minmax(150px, 1fr))` }}>
                <div className="font-semibold text-sm text-muted-foreground p-2">Participants</div>
                {timeSlots.map((slot, index) => (
                  <div key={index} className="text-center p-2">
                    <div className="font-semibold text-sm mb-1">{formatDate(slot.date)}</div>
                    <div className="text-xs text-muted-foreground mb-1">{formatTime(slot.hour)}</div>
                    <div className="text-xs text-blue-600 font-medium">
                      👥 {getParticipantCount(index)} available
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                {table.rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid gap-2 items-center py-3 border-b hover:bg-gray-50"
                    style={{ gridTemplateColumns: `200px repeat(${timeSlots.length}, minmax(150px, 1fr))` }}
                  >
                    <div className="font-medium p-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                        {row.cells[0]?.value.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span>{row.cells[0]?.value || ''}</span>
                    </div>
                    {timeSlots.map((slot, slotIndex) => {
                      const cellIndex = slotIndex + 1;
                      const cellValue = row.cells[cellIndex]?.value || '';
                      const isAvailable = cellValue.trim() === '✅';
                      return (
                        <div key={slotIndex} className="text-center p-2">
                          {isAvailable ? (
                            <span className="text-green-600 font-bold text-xl">✓</span>
                          ) : (
                            <span className="text-muted-foreground text-lg">—</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

