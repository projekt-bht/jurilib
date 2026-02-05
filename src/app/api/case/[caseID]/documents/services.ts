import { BlobServiceClient } from '@azure/storage-blob';
import { NextResponse } from 'next/server';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';

const sasToken = process.env.AZURE_BLOB_SAS;
const storageBaseURL = process.env.AZURE_STORAGE_BASE_URL;

/**
 * Generate a document URL for storing in the database
 * @param caseID Case ID
 * @param fileName File name
 * @param isPrivate Whether the document is private (user-only)
 * @param userID User ID (required if isPrivate is true)
 * @returns API endpoint URL for accessing the document
 */
export function generateDocumentUrl(
  caseID: string,
  fileName: string,
  isPrivate: boolean,
  userID?: string
): string {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}case/${caseID}/documents`;
  const searchParams = new URLSearchParams({ fileName });

  if (isPrivate) {
    if (!userID) {
      throw new ValidationError('missingRequiredValue', 'userID', undefined, 400);
    }
    return `${baseUrl}/user?${searchParams.toString()}`;
  }

  return `${baseUrl}?${searchParams.toString()}`;
}

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
      blobUrl: `${storageBaseURL}/${blobName}?${sasToken}`,
    };
  } catch (error) {
    if (error instanceof ValidationError) throw error;
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
      throw new ValidationError('notFound', 'fileName', fileName, 404);
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': blob.type || 'application/octet-stream',
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new Error('Failed to fetch blobs: ' + (error as Error).message);
  }
}

/**
 * Updates the documentURL array of a case. If the name/url is already set, it does nothing
 * @param caseID
 * @param documentUrl
 */
export async function updateDocumentArray(caseID: string, documentUrl: string) {
  try {
    // Check if document URL already exists
    const existingCase = await prisma.case.findUnique({
      where: { id: caseID },
      select: { documentsURL: true },
    });

    // Save the document URL to the database, only if it's not already existing
    if (!existingCase?.documentsURL.includes(documentUrl)) {
      await prisma.case.update({
        where: { id: caseID },
        data: {
          documentsURL: {
            push: documentUrl,
          },
        },
      });
    }
  } catch (error) {
    throw new Error('Failed to update case document URLs: ' + (error as Error).message);
  }
}
