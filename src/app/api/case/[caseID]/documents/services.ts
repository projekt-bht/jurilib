import { BlobServiceClient } from '@azure/storage-blob';
import { NextResponse } from 'next/server';

import { storageBaseURL } from '@/app/api/helper';

const sasToken = process.env.AZURE_BLOB_SAS;

export async function uploadBlob(caseID: string, fileName: string, file: string, userID?: string) {
  try {
    if (!sasToken) {
      throw new Error('Azure SAS token not configured');
    }

    const blobServiceClient = new BlobServiceClient(`${storageBaseURL}?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient('');

    const blobName = userID ? `${caseID}/${userID}/${fileName}` : `${caseID}/${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Convert base64 string to Buffer if needed
    const fileBuffer = Buffer.from(file, 'base64');

    await blockBlobClient.upload(fileBuffer, fileBuffer.length);

    return {
      name: blobName,
      url: `${storageBaseURL}/${blobName}?${sasToken}`,
    };
  } catch (error) {
    throw new Error('File upload failed: ' + (error as Error).message);
  }
}

/**
 *
 * @param caseID
 * @param fileName
 * @param userID
 * @returns gets exactly one single blob from azure storage. Either by route /:caseID/filename or /:caseID/:userID/filename
 */
export async function getBlob(caseID: string, fileName: string, userID?: string) {
  try {
    const blobUrl = userID
      ? `${storageBaseURL}/${caseID}/${userID}/${fileName}?${sasToken}`
      : `${storageBaseURL}/${caseID}/${fileName}?${sasToken}`;

    // Fetch the blob from Azure
    const response = await fetch(blobUrl);
    if (!response.ok) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': blob.type || 'application/octet-stream',
      },
    });
  } catch (error) {
    throw new Error('Failed to fetch blobs: ' + (error as Error).message);
  }
}
