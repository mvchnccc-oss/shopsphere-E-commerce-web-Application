"use client";
import type { AdminUser } from "@/lib/interfaces/admin.interface";
import { LoaderIcon, LockIcon, UnlockIcon } from "lucide-react";

interface ConfirmModalProps {
  user: AdminUser;
  nextLockState: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function ConfirmModal({
  user,
  nextLockState,
  onConfirm,
  onCancel,
  isPending,
}: Readonly<ConfirmModalProps>) {
  const action = nextLockState ? "Lock" : "Unlock";
  const actionColor = nextLockState
    ? "bg-amber-600 hover:bg-amber-700"
    : "bg-emerald-600 hover:bg-emerald-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <h2 className="text-lg font-bold text-center text-white mb-2">{action} User?</h2>
        <p className="text-slate-400 text-sm text-center mb-1">
          You're about to {action.toLowerCase()}
        </p>
        <p className="text-sm font-semibold text-center text-white mb-6">{user.name}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 py-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${actionColor}`}
          >
            {isPending ? (
              <>
                <LoaderIcon className="size-4 animate-spin" /> Working...
              </>
            ) : (
              <>
                {nextLockState ? (
                  <LockIcon className="size-4" />
                ) : (
                  <UnlockIcon className="size-4" />
                )}{" "}
                {action}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
