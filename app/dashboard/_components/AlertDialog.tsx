import React from "react";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50">
      <div className="fixed top-0 left-0 w-full h-full bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg p-6 z-10">
        <h2 className="text-lg font-bold mb-4">Confirmation</h2>
        <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
        <div className="flex justify-end mt-4">
          <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Annuler
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={onConfirm}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog; 