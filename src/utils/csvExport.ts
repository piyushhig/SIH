/**
 * LANDGUARD AI Data Export Utility
 * Handles RFC-4180 compliant CSV generation and client-side browser download
 */

export interface CsvColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number | boolean | null | undefined);
}

export function exportToCsv<T>(
  data: T[],
  columns: CsvColumn<T>[],
  fileNamePrefix: string
): void {
  if (!data || data.length === 0) {
    console.warn('exportToCsv: No data to export');
    return;
  }

  // Format headers
  const headerRow = columns
    .map((col) => `"${col.header.replace(/"/g, '""')}"`)
    .join(',');

  // Format body rows
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        let value: any;
        if (typeof col.accessor === 'function') {
          value = col.accessor(item);
        } else {
          value = item[col.accessor];
        }

        if (value === null || value === undefined) {
          return '""';
        }

        const stringValue = String(value);
        // Escape quotes
        return `"${stringValue.replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  // Include UTF-8 Byte Order Mark (BOM) so Microsoft Excel opens it with correct UTF-8 encoding
  const csvContent = '\uFEFF' + [headerRow, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Generate dated filename
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const fullFileName = `${fileNamePrefix}_${dateStr}.csv`;

  // Trigger download via temporary anchor
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fullFileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
