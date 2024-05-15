import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { storage } from "../../../firebase/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";

const CoverImageCropper = ({ closeModal, updateCoverImage, submitCoverUpload }) => {
    const editorRef = useRef(null);
    const [imgSrc, setImgSrc] = useState("");
    const [error, setError] = useState("");
    const [scale, setScale] = useState(1);

    const onSelectFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || "";
            imageElement.src = imageUrl;
            imageElement.addEventListener("load", (e) => {
                if (error) setError("");
            });
            setImgSrc(imageUrl);
        });
        reader.readAsDataURL(file);
    };

    const handleCropImage = async () => {
        try {
            const dataUrl = editorRef.current.getImageScaledToCanvas().toDataURL();
            console.log(dataUrl);
            const blob = await fetch(dataUrl).then((res) => res.blob());

            const formData = new FormData();
            formData.append('file', blob);

            await submitCoverUpload(blob);

            // const response = await fetch('https://your-server.com/api/upload', {
            //     method: 'POST',
            //     body: formData,
            // });

            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

            // const data = await response.json();
            // updateCoverImage(data.filePath);
            // closeModal();
        } catch (error) {
            console.error("Error handling or uploading image:", error);
            setError(`Error handling or uploading image: ${error.message}`);
        }
    };

    return (
        <>
            <label className="block mb-3 w-fit p-10">
                <span className="sr-only">Choose cover photo</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="block w-full text-lg text-slate-500 file:mr-4 file:py-1 file:px-10 file:rounded-full file:border-0 file:text-lg file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
            </label>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            {imgSrc && (
                <div className="flex flex-col items-center p-5 border bg-gray-200 rounded-lg">
                    <AvatarEditor
                        ref={editorRef}
                        image={imgSrc}
                        width={800}
                        height={300}
                        border={0}
                        color={[0, 0, 0, 0.6]} // Black, semi-transparent
                        scale={scale}
                        borderRadius={0}
                    />
                    <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="mt-2"
                    />
                    <button
                        className="text-white text-lg py-2 px-4 rounded-2xl mt-2 bg-blue-700 hover:bg-blue-800"
                        onClick={handleCropImage}
                    >
                        Crop Image
                    </button>
                </div>
            )}
        </>
    );
};

export default CoverImageCropper;
