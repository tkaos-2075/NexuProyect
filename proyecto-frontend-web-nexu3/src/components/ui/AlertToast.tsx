import React from "react";
import BaseModal from "@components/common/BaseModal";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  buttonText?: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  title = "Aviso",
  message = "",
  icon = "ℹ️",
  buttonText = "Entendido"
}: AlertModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center py-6">
        <div className="text-5xl mb-4">{icon}</div>
        <p className="text-gray-700 dark:text-gray-300 text-center mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold"
        >
          {buttonText}
        </button>
      </div>
    </BaseModal>
  );
} 