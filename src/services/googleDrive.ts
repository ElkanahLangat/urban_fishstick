import { getAccessToken } from './googleAuth';

export interface DriveCommuteFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  webViewLink?: string;
  size?: string;
}

/**
 * List commute receipts and documents created by Urban Fishstick in Google Drive
 */
export const listDriveCommuteFiles = async (): Promise<DriveCommuteFile[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google');

  const query = encodeURIComponent("name contains 'UrbanFishstick' and trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,createdTime,webViewLink,size)&orderBy=createdTime desc`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to list Google Drive files');
  }

  const data = await res.json();
  return data.files || [];
};

/**
 * Upload a commute receipt or overtime insurance document to Google Drive
 */
export const saveReceiptToGoogleDrive = async (
  filename: string,
  receiptData: Record<string, any>
): Promise<DriveCommuteFile> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google');

  const metadata = {
    name: filename.endsWith('.json') ? filename : `${filename}.json`,
    mimeType: 'application/json',
    description: 'Nairobi Matatu Commute & Office Delay Insurance Receipt by Urban Fishstick'
  };

  const fileContent = JSON.stringify(receiptData, null, 2);

  // Multipart upload to Google Drive
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,createdTime,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to save receipt to Google Drive');
  }

  return await res.json();
};

/**
 * Delete a commute file from Google Drive (MUST be guarded with explicit confirmation UI)
 */
export const deleteDriveFile = async (fileId: string): Promise<void> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to delete file from Google Drive');
  }
};
