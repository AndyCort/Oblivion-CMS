import React, { useState, useRef, useId } from "react";
import type { Article } from "../../types/article";
import { parseImportSource } from "../../lib/importer/importParser";
import type { ImportStats } from "../../lib/importer/importParser";
import {
  UploadCloud,
  FileCode,
  FileText,
  Layers,
  AlertTriangle,
  X,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  Tag,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Trash2,
} from "lucide-react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (articles: Article[], mode: "merge" | "overwrite") => Promise<void>;
  currentTotalArticles?: number;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentTotalArticles = 0,
}) => {
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [parsedArticles, setParsedArticles] = useState<Article[]>([]);
  const [parsedStats, setParsedStats] = useState<ImportStats | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<"merge" | "overwrite">("merge");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreviewList, setShowPreviewList] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputId = useId();

  if (!isOpen) return null;

  const handleReset = () => {
    setRawText("");
    setFileName(null);
    setFileSize(null);
    setParsedArticles([]);
    setParsedStats(null);
    setParseError(null);
    setShowPreviewList(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processContent = (content: string, name?: string, sizeBytes?: number) => {
    setParseError(null);
    try {
      const result = parseImportSource(content);
      setParsedArticles(result.articles);
      setParsedStats(result.stats);
      if (name) setFileName(name);
      if (sizeBytes !== undefined) {
        setFileSize(
          sizeBytes > 1024 * 1024
            ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
            : `${(sizeBytes / 1024).toFixed(1)} KB`
        );
      }
    } catch (err: any) {
      setParsedArticles([]);
      setParsedStats(null);
      setParseError(err.message || "未能识别有效的数据结构");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || "");
      setRawText(content);
      processContent(content, file.name, file.size);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || "");
      setRawText(content);
      processContent(content, file.name, file.size);
    };
    reader.readAsText(file);
  };

  const handlePasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRawText(text);
    if (text.trim().length > 0) {
      processContent(text);
    } else {
      setParsedArticles([]);
      setParsedStats(null);
      setParseError(null);
    }
  };

  const handleSubmit = async () => {
    if (parsedArticles.length === 0 || isSubmitting) return;

    if (
      importMode === "overwrite" &&
      !window.confirm(
        `确定要进行【全量覆盖】吗？\n\n此操作将清空现有全部 ${currentTotalArticles} 篇文章，并写入导入的 ${parsedArticles.length} 篇新数据，该操作不可撤销！`
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setParseError(null);
    try {
      await onImport(parsedArticles, importMode);
      handleReset();
      onClose();
    } catch (err: any) {
      setParseError(err.message || "导入过程中发生异常");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}.${m}.${day}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl sm:rounded-3xl max-w-xl w-full p-4.5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-xs">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                导入历史数据
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                支持 moments.ts (TS/JS 源码) 或 JSON 格式数组
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("file")}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "file"
                ? "bg-white dark:bg-stone-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>选择或拖拽文件</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("paste")}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "paste"
                ? "bg-white dark:bg-stone-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>粘贴代码 / JSON</span>
          </button>
        </div>

        {/* Input Area */}
        {activeTab === "file" ? (
          <div>
            <input
              type="file"
              id={fileInputId}
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".ts,.tsx,.js,.jsx,.json,.txt"
              className="hidden"
            />
            <label
              htmlFor={fileInputId}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragOver
                  ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                  : fileName
                  ? "border-emerald-400/80 bg-emerald-50/30 dark:bg-emerald-950/10"
                  : "border-stone-200 dark:border-stone-800 hover:border-indigo-400/80 hover:bg-stone-50 dark:hover:bg-stone-800/40"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2.5 transition-colors ${
                  fileName
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                    : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                }`}
              >
                {fileName ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <UploadCloud className="w-5 h-5" />
                )}
              </div>
              {fileName ? (
                <div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {fileName}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    大小: {fileSize} · 点击更换文件
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                    点击选择文件 或 将文件拖放到此处
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    支持 .ts, .tsx, .js, .json 文件 (例如 moments.ts)
                  </div>
                </div>
              )}
            </label>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="relative">
              <textarea
                value={rawText}
                onChange={handlePasteChange}
                placeholder={`请粘贴历史说说数据，例如：\n\nexport const moments = [\n  {\n    time: 1789122720000,\n    content: "今天出去走了走。",\n    tags: ["日常"]\n  }\n];\n\n或直接粘贴 JSON 数组：\n[ { "time": 1789122720000, "content": "..." } ]`}
                rows={7}
                className="w-full text-xs font-mono p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {rawText && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute right-2.5 top-2.5 p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 bg-stone-200/60 dark:bg-stone-800 transition-colors"
                  title="清空内容"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error message */}
        {parseError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-medium">解析失败</span>
              <p className="text-[11px] text-rose-600 dark:text-rose-400">
                {parseError}
              </p>
            </div>
          </div>
        )}

        {/* Parsed summary card */}
        {parsedStats && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>解析成功：共发现 {parsedStats.total} 篇文章</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewList(!showPreviewList)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                <span>{showPreviewList ? "收起预览" : "展开预览"}</span>
                {showPreviewList ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-indigo-100 dark:border-stone-800">
                <div className="text-[10px] text-stone-500 flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>时间范围</span>
                </div>
                <div className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5 text-[11px] truncate">
                  {formatDate(parsedStats.earliestTime)} ~ {formatDate(parsedStats.latestTime)}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-indigo-100 dark:border-stone-800">
                <div className="text-[10px] text-stone-500 flex items-center justify-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>媒体数量</span>
                </div>
                <div className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5 text-[11px]">
                  {parsedStats.mediaCount} 项
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-indigo-100 dark:border-stone-800">
                <div className="text-[10px] text-stone-500 flex items-center justify-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>标签分类</span>
                </div>
                <div className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5 text-[11px]">
                  {parsedStats.uniqueTags.length} 个
                </div>
              </div>
            </div>

            {/* Collapsible preview of top 3 articles */}
            {showPreviewList && (
              <div className="space-y-2 pt-1 border-t border-indigo-100 dark:border-indigo-900/60 max-h-48 overflow-y-auto no-scrollbar">
                {parsedArticles.slice(0, 3).map((article, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                      <span>{formatDate(article.time)}</span>
                      {article.location && <span>📍 {article.location}</span>}
                    </div>
                    <p className="line-clamp-2 text-stone-700 dark:text-stone-300">
                      {article.content || "（无文本内容）"}
                    </p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap pt-0.5">
                        {article.tags.map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.2 rounded text-[9px] bg-stone-100 dark:bg-stone-800 text-stone-500"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {parsedArticles.length > 3 && (
                  <div className="text-center text-[10px] text-stone-400 py-0.5">
                    还有其余 {parsedArticles.length - 3} 篇文章...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Import Mode Selection */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
            选择导入策略
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Merge mode */}
            <div
              onClick={() => setImportMode("merge")}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                importMode === "merge"
                  ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-500"
                  : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    importMode === "merge"
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-stone-400"
                  }`}
                >
                  {importMode === "merge" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  增量合并 (推荐)
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 pl-6">
                按时间戳对齐，新增未存在文章，更新已有文章，保留数据库现存内容。
              </p>
            </div>

            {/* Overwrite mode */}
            <div
              onClick={() => setImportMode("overwrite")}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                importMode === "overwrite"
                  ? "border-amber-500 bg-amber-50/40 dark:bg-amber-950/30 ring-1 ring-amber-500"
                  : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    importMode === "overwrite"
                      ? "border-amber-600 bg-amber-600 text-white"
                      : "border-stone-400"
                  }`}
                >
                  {importMode === "overwrite" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  全量覆盖
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 pl-6">
                清空云端现存全部文章，完全替换为本次导入数据（不可逆，请谨慎）。
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            取消
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={parsedArticles.length === 0 || isSubmitting}
            className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
              parsedArticles.length === 0 || isSubmitting
                ? "bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed"
                : importMode === "overwrite"
                ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>正在写入 Cloudflare D1...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>
                  {parsedArticles.length > 0
                    ? `确认导入 (${parsedArticles.length} 篇)`
                    : "请先解析有效数据"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
