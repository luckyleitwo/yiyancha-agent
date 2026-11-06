export type ExcelCellValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export interface ExcelColumn<Row> {
  header: string;
  value: (row: Row, index: number) => ExcelCellValue;
  width?: number;
  numFmt?: string;
}

export interface ExportExcelOptions<Row> {
  fileName: string;
  sheetName?: string;
  columns: ExcelColumn<Row>[];
  data: readonly Row[];
}

/** Generate and download a single-sheet XLSX in the browser. */
export async function exportExcel<Row>({
  fileName,
  sheetName = 'Sheet1',
  columns,
  data,
}: ExportExcelOptions<Row>): Promise<void> {
  if (!fileName.trim()) throw new Error('Excel 文件名不能为空');
  if (!columns.length) throw new Error('Excel 导出列不能为空');

  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  worksheet.columns = columns.map(({ header, width, numFmt }) => ({
    header,
    width,
    style: numFmt ? { numFmt } : undefined,
  }));
  worksheet.getRow(1).font = { bold: true };
  data.forEach((row, index) => {
    worksheet.addRow(columns.map((column) => column.value(row, index) ?? null));
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = /\.xlsx$/i.test(fileName) ? fileName : `${fileName}.xlsx`;
    document.body.appendChild(link);
    try {
      link.click();
    } finally {
      link.remove();
    }
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
}
