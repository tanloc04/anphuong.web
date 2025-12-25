import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ModalProps } from './ProductManagement/types'; 
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl z-50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faXmark} className='w-6 h-6' />
          </button>
        </div>
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;