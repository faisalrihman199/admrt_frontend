import React, { useState } from 'react';
import ImageCropper from '../../Layout/context/cropImg/cropImg';

const ProfileImageUploadForm = ({ submitFileUpload }) => {
    const [file, setFile] = useState(null);
    const [isUploaded, setIsUploaded] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setIsUploaded(true);
    };

    // const handleSubmitFile = () => {
    //     if (file) {
    //         submitFileUpload(file);
    //         console.log('im herex');
    //     }
    // };

    return (
        <div className='flex items-center justify-center gap-3 p-5 h-80'>
            {/* {!isUploaded ? (
                <label htmlFor="dropzone-file" className="flex flex-col items-center w-full p-5 text-center bg-white border-2 border-blue-600 border-dashed cursor-pointer rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    <h2 className="mt-1 font-medium tracking-wide text-blue-600">Upload</h2>
                    <p className="mt-2 text-xs tracking-wide text-gray-600">Upload 1MB your file PNG, JPG. </p>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".png,.jpg" multiple />
                </label>
            ) : (
                <ImageCropper file={file} onSubmit={handleSubmitFile} />
            )} */}
            <ImageCropper submitFileUpload={submitFileUpload} />

        </div>
    );
};

export default ProfileImageUploadForm;