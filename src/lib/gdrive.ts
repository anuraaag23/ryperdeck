/**
 * Google Drive file upload client for RyperDeck
 * Sends file base64 data to a Google Apps Script Web App endpoint,
 * which creates the file directly inside your Google Drive and returns the shareable link.
 */

const GDRIVE_UPLOAD_URL = (import.meta as any).env?.VITE_GDRIVE_UPLOAD_URL || '';

export interface GDriveUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadToGoogleDrive(file: File): Promise<GDriveUploadResult> {
  if (!GDRIVE_UPLOAD_URL) {
    console.warn('VITE_GDRIVE_UPLOAD_URL is not configured in .env');
    return {
      success: false,
      error: 'Google Drive upload endpoint is not configured.',
    };
  }

  try {
    // 1. Convert File to Base64
    const base64 = await fileToBase64(file);

    // 2. Send payload to Google Apps Script Web App
    const payload = {
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      base64: base64.split(',')[1] || base64, // strip data:image/...;base64,
    };

    const response = await fetch(GDRIVE_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Google Apps Script handles text/plain with JSON body seamlessly
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.status === 'success' && data.url) {
      return {
        success: true,
        url: data.url,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Google Drive upload failed.',
      };
    }
  } catch (err: any) {
    console.error('Failed to upload file to Google Drive:', err);
    return {
      success: false,
      error: err?.message || 'Network error while uploading to Google Drive.',
    };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
