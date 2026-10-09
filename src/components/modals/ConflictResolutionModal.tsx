import React, { useState } from "react";
import { AlertCircle, RefreshCw, Copy, Check, X, UploadCloud } from "lucide-react";
import type { Article } from "../../types/article";

interface ConflictResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReloadRemote: () => void;
  onForcePublish: () => void;
  localArticle: Article;
  remoteSha?: string;
  clientBaseSha?: string;
  isPublishing?: boolean;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  isOpen,
  onClose,
  onReloadRemote,
  onForcePublish,
  localArticle,
  remoteSha,
  clientBaseSha,
  isPublishing = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(JSON.stringify(localArticle, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-800/80 rounded-2xl max-w-lg w-full p-4.5 sm:p-6 shadow-2xl space-y-4 max-h-[92dvh] overflow-y-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              检测到远程发布冲突 (409 Conflict)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              在您编辑期间，数据库中的文章数据版本与您编辑基准不一致。您的本地草稿已妥善保存在当前浏览器中。您可以拉取最新数据，或以当前草稿强制覆盖发布。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-950 text-xs font-mono text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800">
          <div>客户端基准版本: {clientBaseSha?.slice(0, 16) || "未知"}</div>
          <div>远程最新版本: {remoteSha?.slice(0, 16) || "已更新"}</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopyDraft}
            className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "已复制本地草稿" : "复制草稿 JSON 备份"}
          </button>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              disabled={isPublishing}
              onClick={onClose}
              className="px-3 py-2 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors disabled:opacity-50"
            >
              稍后处理
            </button>
            <button
              type="button"
              disabled={isPublishing}
              onClick={onReloadRemote}
              className="px-3 py-2 text-xs bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-medium rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              拉取最新远程数据
            </button>
            <button
              type="button"
              disabled={isPublishing}
              onClick={onForcePublish}
              className="px-3.5 py-2 text-xs bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {isPublishing ? "正在覆盖..." : "强制覆盖发布"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
