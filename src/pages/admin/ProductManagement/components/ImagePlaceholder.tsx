
const ImagePlaceholder = ({ label } : any) => {
  return (
    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center border border-dashed">
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

export default ImagePlaceholder;