import React from 'react';
import { AlertTriangle, Trash2, HelpCircle } from 'lucide-react';
import Modal from './Modal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // danger, warning, info
  loading = false,
}) => {
  const colorScheme = {
    danger: {
      icon: Trash2,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      btn: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      btn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white',
    },
    info: {
      icon: HelpCircle,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      btn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
    },
  }[type];

  const IconComponent = colorScheme.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4">
        <div className={`w-12 h-12 shrink-0 rounded-full border flex items-center justify-center ${colorScheme.iconBg}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-55"
        >
          {cancelText}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={onConfirm}
          className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-55 ${colorScheme.btn}`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
              Processing...
            </div>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
