import React, { useState } from "react";
import { AlertCircle, RefreshCw, Copy, Check, X } from "lucide-react";
import type { Article } from "../../types/article";

interface ConflictResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReloadRemote: () => void;
  localArticle: Article;
  remoteSha?: string;
  clientBaseSha?: string;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  isOpen,
  onClose,
  onReloadRemote,
  localArticle,
  remoteSha,
  clientBaseSha,
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
              在您编辑期间，数据库中的文章数据已被其他操作修改。为了防止覆盖他人提交，系统已阻止此次更新。您的本地草稿已妥善保存在当前浏览器中。
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
          <div>客户端基准 SHA: {clientBaseSha?.slice(0, 10) || "未知"}</div>
          <div>远程最新 SHA: {remoteSha?.slice(0, 10) || "已更新"}</div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleCopyDraft}
            className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "已复制本地草稿" : "复制本地草稿 JSON 备份"}
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
            >
              稍后处理
            </button>
            <button
              type="button"
              onClick={onReloadRemote}
              className="px-3.5 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              拉取最新远程数据
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
