import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Spinner from './Spinner';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn btn-secondary btn-md"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn btn-md ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
          >
            {isLoading ? <Spinner size="sm" /> : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
