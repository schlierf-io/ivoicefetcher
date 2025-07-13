export interface Invoice {
  id: string;
  targetPageId: string;
  filename: string;
  invoiceName: string;
  invoiceDate: Date;
  downloadDate: Date;
  filePath: string;
  fileSize: number;
  checksum: string;
  status: 'downloaded' | 'pending' | 'error';
  createdAt: Date;
}

export interface InvoiceData {
  invoiceName: string;
  invoiceDate: Date;
  downloadUrl: string;
  filename: string;
}