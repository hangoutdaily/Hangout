import api from './axios';
import axios from 'axios';

interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  viewUrl: string;
}

export const getPresignedUrl = async (fileName: string, fileType: string) => {
  const response = await api.post<PresignedUrlResponse>('/upload/presigned-url', {
    fileName,
    fileType,
  });
  return response.data;
};

export const uploadFileToS3 = async (uploadUrl: string, file: File) => {
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};
