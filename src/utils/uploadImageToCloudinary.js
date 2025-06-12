import axios from 'axios';

const CLOUD_NAME = 'dvjyghl8w';
const UPLOAD_PRESET = 'ohsansi';
const FOLDER_NAME = 'OhSansi';


const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', FOLDER_NAME);
  formData.append('timestamp', (Date.now() / 1000).toFixed(0));

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data.secure_url;
    }
    throw new Error('Error en la respuesta de Cloudinary');

  } catch (error) {
    const errorMessage = error.response?.data?.error?.message
      || error.message
      || 'Error desconocido al subir la imagen';
    console.error('Error en subida:', {
      error: errorMessage,
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size
      }
    });
    throw new Error(errorMessage);
  }
};

export default uploadImageToCloudinary;