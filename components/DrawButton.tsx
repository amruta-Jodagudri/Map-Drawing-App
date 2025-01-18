import React from 'react';

interface DrawButtonProps {
  onClick: () => void;
}

const DrawButton: React.FC<DrawButtonProps> = ({ onClick }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      Draw
    </button>
  );
};

export default React.memo(DrawButton);

