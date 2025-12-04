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

export function formatTableHeader(date: Date, hour: number): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(hour).padStart(2, "0");
  const minutes = "00";
  return `${day}.${month}.<br>${hours}:${minutes}`;
}

export function parseTableHeader(
  header: string
): { date: Date; hour: number } | null {
  const normalizedHeader = header.replace(/<br\s*\/?>/gi, "\n").trim();
  const parts = normalizedHeader.split("\n");

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
  const date = new Date(currentYear, month, day, hour, minute);

  if (isNaN(date.getTime())) {
    return null;
  }

  return { date, hour };
}

export interface TimeSlotData {
  date: Date;
  hour: number;
  participants: string[];
}

export function parseTableToTimeSlots(table: ParsedTable): TimeSlotData[] {
  if (table.headers.length < 2) {
    return [];
  }

  const timeSlots: TimeSlotData[] = [];

  for (let i = 1; i < table.headers.length; i++) {
    const header = table.headers[i];
    const slotInfo = parseTableHeader(header);

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
