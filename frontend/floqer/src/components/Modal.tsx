import React, {useRef} from "react";

interface ModalProps {
    isMobile: boolean,
    onClose: any
}


const Modal: React.FC<ModalProps> = ({isMobile, onClose}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
        if(modalRef.current===e.target){
            onClose();
        }
    }
    return(
        <div ref={modalRef} onClick={closeModal} className="w-full h-full fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
            <div className={`${!isMobile && 'w-1/2'} flex flex-col text-white px-10`}>
                <button onClick={onClose} className="place-self-end text-xl">&times;</button>
                <div className="bg-cream rounded-md flex flex-col p-4 gap-4 text-darkpurple text-md font-medium">
                    <h1 className="text-xl font-bold text-purple">Note</h1>
                    <p>The data on the dashboard is fetched from a server currently hosted on Render. There might be a short delay for the data to populate on the site.</p>
                    <p>The chatbot is temporarily powered by Gemini which returns responses based on some sample data. Chatbot responses take 25-45 seconds.</p>
                </div>

            </div>
        </div>
    );
}

export default Modal;