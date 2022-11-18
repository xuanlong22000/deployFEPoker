import axios from 'axios';
const CLOUDINARY_API = 'https://api.cloudinary.com/v1_1/dvnchwzbe/upload';
const CLOUDINARY_UPLOAD_PRESET = 'xb9v0cuf';
const CLOUDINARY_FOLDER = 'napa planning poker';

const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', CLOUDINARY_FOLDER);
  return axios.post(CLOUDINARY_API, formData, {
    headers: { 'Content-type': 'multipart/form-data' },
  });
};

export { uploadAvatar };
