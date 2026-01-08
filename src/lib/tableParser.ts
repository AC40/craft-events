export interface TableCell {
  value: string;
}

export interface TableRow {
  cells: TableCell[];
}

export interface ParsedTable {
  headers: string[];
  rows: TableRow[];
}

export function parseMarkdownTable(markdown: string): ParsedTable | null {
  const lines = markdown
    .trim()
    .split("\n")
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return null;
  }

  const headerLine = lines[0];
  const separatorLine = lines[1];
  // Timezone is now stored in a separate block, not in the table
  // So we start data lines right after the separator
  const dataLines = lines.slice(2);

  if (!headerLine.startsWith("|") || !headerLine.endsWith("|")) {
    return null;
  }

  const parseRow = (line: string): string[] => {
    return line
      .slice(1, -1)
      .split("|")
      .map((cell) => {
        const trimmed = cell.trim();
        return trimmed.replace(/<br\s*\/?>/gi, "\n");
      });
  };

  const headers = parseRow(headerLine);
  const rows = dataLines.map((line) => ({
    cells: parseRow(line).map((value) => ({ value })),
  }));

  return { headers, rows };
}

export function formatTableHeader(date: Date, timezone: string): string {
  // Format the date object (which represents the correct moment in the creator's timezone)
  // The date already contains the correct UTC time that represents the moment in the creator's timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Format the date in the creator's timezone
  const parts = formatter.formatToParts(date);

  const day = parts.find((p) => p.type === "day")?.value || "01";
  const month = parts.find((p) => p.type === "month")?.value || "01";
  const hours = parts.find((p) => p.type === "hour")?.value || "00";
  const minutes = parts.find((p) => p.type === "minute")?.value || "00";

  // Debug logging (remove in production)
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("[formatTableHeader]", {
      dateUTC: date.toISOString(),
      timezone,
      formatted: `${day}.${month}. ${hours}:${minutes}`,
    });
  }

  // Use single-line format without HTML to comply with Craft's markdown parser
  // which doesn't allow HTML tags in table header cells
  return `${day}.${month}. ${hours}:${minutes}`;
}

/**
 * Converts a date/time in a specific timezone to a Date object (UTC)
 * Uses binary search to find the UTC time that formats to the desired values in target timezone
 */
function createDateInTimezone(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timezone: string
): Date {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Start with a reasonable UTC guess (assuming timezone is within ±15 hours of UTC)
  const baseUtc = Date.UTC(year, month, day, hour, minute);
  const searchWindow = 16 * 60 * 60 * 1000; // 16 hours in milliseconds
  let low = baseUtc - searchWindow;
  let high = baseUtc + searchWindow;

  // Binary search for the correct UTC time
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

    // Check if we have an exact match
    if (
      tzYear === year &&
      tzMonth === month &&
      tzDay === day &&
      tzHour === hour &&
      tzMinute === minute
    ) {
      return testDate;
    }

    // Compare to determine search direction
    // Create comparable timestamps (in the target timezone's "local" representation)
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

  // Return the best match found
  return new Date(Math.floor((low + high) / 2));
}

export function parseTableHeader(
  header: string,
  timezone: string
): { date: Date; hour: number } | null {
  // Normalize header: handle both old format with <br> tags and new single-line format
  const normalizedHeader = header.replace(/<br\s*\/?>/gi, " ").trim();
  
  // Try to parse single-line format: "DD.MM. HH:MM"
  const singleLineMatch = normalizedHeader.match(/(\d{2})\.(\d{2})\.\s+(\d{2}):(\d{2})/);
  
  if (singleLineMatch) {
    const day = parseInt(singleLineMatch[1], 10);
    const month = parseInt(singleLineMatch[2], 10) - 1;
    const hour = parseInt(singleLineMatch[3], 10);
    const minute = parseInt(singleLineMatch[4], 10);
    
    const currentYear = new Date().getFullYear();
    const date = createDateInTimezone(
      currentYear,
      month,
      day,
      hour,
      minute,
      timezone
    );
    
    if (isNaN(date.getTime())) {
      return null;
    }
    
    // Debug logging (remove in production)
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      console.log("[parseTableHeader]", {
        header,
        parsed: `${day}.${month + 1}. ${hour}:${minute}`,
        timezone,
        dateUTC: date.toISOString(),
      });
    }
    
    return { date, hour };
  }
  
  // Fallback: try to parse old two-line format (for backward compatibility)
  const parts = normalizedHeader.split(/\s+/);
  if (parts.length < 2) {
    return null;
  }

  const datePart = parts[0].trim();
  const timePart = parts[1].trim();

  const dateMatch = datePart.match(/(\d{2})\.(\d{2})\./);
  const timeMatch = timePart.match(/(\d{2}):(\d{2})/);

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const day = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10) - 1;
  const hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2], 10);

  const currentYear = new Date().getFullYear();

  // Parse the date/time components as being in the creator's timezone
  const date = createDateInTimezone(
    currentYear,
    month,
    day,
    hour,
    minute,
    timezone
  );

  if (isNaN(date.getTime())) {
    return null;
  }

  // Debug logging (remove in production)
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("[parseTableHeader]", {
      header,
      parsed: `${day}.${month + 1}. ${hour}:${minute}`,
      timezone,
      dateUTC: date.toISOString(),
    });
  }

  return { date, hour };
}

export interface TimeSlotData {
  date: Date;
  hour: number;
  participants: string[];
}

/**
 * Extracts timezone from markdown content
 * Looks for [TIMEZONE: <timezone>] format in markdown (table row or standalone)
 */
export function extractTimezone(markdown: string): string | null {
  // Format: [TIMEZONE: Europe/Berlin] - can be in a table row or standalone
  const bracketMatch = markdown.match(/\[TIMEZONE:\s*([^\]]+)\]/i);
  if (bracketMatch) {
    return bracketMatch[1].trim();
  }

  // Legacy format: <!-- TIMEZONE: Europe/Berlin --> (for backward compatibility)
  const commentMatch = markdown.match(/<!--\s*TIMEZONE:\s*([^\s]+)\s*-->/i);
  if (commentMatch) {
    return commentMatch[1];
  }

  return null;
}

/**
 * Formats timezone metadata as a markdown block
 * Uses bracket format that Craft accepts
 */
export function formatTimezoneBlock(timezone: string): string {
  return `[TIMEZONE: ${timezone}]`;
}

/**
 * Formats a date in a specific timezone
 */
export function formatDateInTimezone(
  date: Date,
  timezone: string | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  const tz = timezone || "UTC";
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: tz,
  };
  return date.toLocaleDateString("en-US", { ...defaultOptions, ...options });
}

/**
 * Formats a time in a specific timezone
 * The date object already represents the correct moment in the creator's timezone
 */
export function formatTimeInTimezone(
  date: Date,
  timezone: string | null | undefined
): string {
  const tz = timezone || "UTC";

  // Format the date (which represents the moment) in the creator's timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const timeStr = formatter.format(date);

  // Also get the next hour for range display
  const nextHourDate = new Date(date.getTime() + 60 * 60 * 1000);
  const nextTimeStr = formatter.format(nextHourDate);

  // Debug logging (remove in production)
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("[formatTimeInTimezone]", {
      dateUTC: date.toISOString(),
      timezone: tz,
      formatted: `${timeStr} - ${nextTimeStr}`,
    });
  }

  return `${timeStr} - ${nextTimeStr}`;
}

/**
 * Gets user's local time for a given date/time in creator's timezone
 * Uses test timezone override if set (for testing)
 */
export function getLocalTimeString(
  date: Date,
  creatorTimezone: string | null | undefined
): string {
  // Use test timezone override if available
  let userTimezone: string;
  if (typeof window !== "undefined") {
    try {
      const { getCurrentTimezone } = require("@/lib/timezoneUtils");
      userTimezone = getCurrentTimezone();
    } catch {
      userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  } else {
    userTimezone = "UTC";
  }

  const creatorTz = creatorTimezone || "UTC";

  if (userTimezone === creatorTz) {
    return ""; // No conversion needed
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    weekday: "short",
  });

  const result = formatter.format(date);

  // Debug logging (remove in production)
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("[getLocalTimeString]", {
      dateUTC: date.toISOString(),
      creatorTimezone: creatorTz,
      userTimezone,
      formatted: result,
    });
  }

  return result;
}

export function parseTableToTimeSlots(
  table: ParsedTable,
  timezone: string | null = null
): TimeSlotData[] {
  if (table.headers.length < 2) {
    return [];
  }

  // Default to UTC if no timezone provided (for backward compatibility)
  const tz = timezone || "UTC";

  const timeSlots: TimeSlotData[] = [];

  for (let i = 1; i < table.headers.length; i++) {
    const header = table.headers[i];
    const slotInfo = parseTableHeader(header, tz);

    if (!slotInfo) {
      continue;
    }

    const participants = table.rows
      .map((row) => {
        if (row.cells.length > i) {
          const cellValue = row.cells[i].value.trim();
          const nameCell = row.cells[0]?.value.trim();
          if (cellValue === "✅" && nameCell) {
            return nameCell;
          }
        }
        return null;
      })
      .filter((name): name is string => name !== null);

    timeSlots.push({
      date: slotInfo.date,
      hour: slotInfo.hour,
      participants,
    });
  }

  return timeSlots;
}

export function tableToMarkdown(table: ParsedTable): string {
  const formatCell = (value: string): string => {
    const trimmed = value.trim();
    const escaped = trimmed.replace(/\|/g, "\\|");
    return escaped.replace(/\n/g, "<br>");
  };

  const headerRow = `| ${table.headers.map(formatCell).join(" | ")} |`;
  const separatorRow = `| ${table.headers.map(() => "---").join(" | ")} |`;
  const dataRows = table.rows.map(
    (row) =>
      `| ${row.cells.map((cell) => formatCell(cell.value)).join(" | ")} |`
  );

  const result = [headerRow, separatorRow, ...dataRows].join("\n");
  return result.trim();
}

export function updateTableWithVote(
  table: ParsedTable,
  participantName: string,
  votes: Record<number, boolean>
): ParsedTable {
  const existingRowIndex = table.rows.findIndex(
    (row) =>
      row.cells[0]?.value.trim().toLowerCase() === participantName.toLowerCase()
  );

  const numColumns = table.headers.length;
  const newRow: TableRow = {
    cells: [
      { value: participantName },
      ...Array.from({ length: numColumns - 1 }, (_, index) => ({
        value: votes[index] === true ? "✅" : "",
      })),
    ],
  };

  if (existingRowIndex >= 0) {
    const updatedRows = [...table.rows];
    updatedRows[existingRowIndex] = newRow;
    return { ...table, rows: updatedRows };
  } else {
    return { ...table, rows: [...table.rows, newRow] };
  }
}
