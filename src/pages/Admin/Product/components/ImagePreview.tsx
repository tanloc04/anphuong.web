import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const ImagePreview = ({ src, onRemove }: {src: string, onRemove: () => void}) => {
  return (
    <div className="relative group">
      <img 
        src={src} 
        alt="preview"
        className="w-full h-full object-cover rounded-md" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FontAwesomeIcon className="w-4 h-4" icon={faX} />
      </button>
    </div>
  )
}

export default ImagePreview