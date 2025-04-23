
import React, { useState } from 'react';
import { storage } from '../../Firebase'; 
import { ref, uploadBytes } from 'firebase/storage';

const UploadImage = () => {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image');
      return;
    }

    try {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      alert('Image uploaded successfully!');
    } catch (error) {
      alert('Error uploading image: ', error.message);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default UploadImage;
