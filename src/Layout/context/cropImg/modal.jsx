import CloseIcon from "./icons/CloseIcon";
import ImageCropper from "./cropImg";

const Modal = ({ updateAvatar, closeModal }) => {
    console.log('im here')
    return (
        <div
            className="relative z-10"
            aria-labelledby="crop-image-dialog"
            role="dialog"
            aria-modal="true"
        >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center pt-[150px] px-20 py-[250px] text-center ">
                    <div className="relative w-[90%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-white text-slate-100 text-left shadow-xl transition-all">
                        <div className="px-5 py-4">
                            <button
                                type="button"
                                className="rounded-md p-1 inline-flex items-center justify-center bg-gray-200 text-gray-400 hover:text-white hover:bg-gray-500 focus:outline-none absolute top-4 right-5"
                                onClick={closeModal}
                            >
                                <span className="sr-only">Close menu</span>
                                <CloseIcon />
                            </button>
                            <ImageCropper
                                updateAvatar={updateAvatar}
                                closeModal={closeModal}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default Modal;
