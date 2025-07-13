import React from 'react';

interface ModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-center">
                <h3 id="modal-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 rounded-full font-semibold text-slate-700 dark:text-slate-200 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;