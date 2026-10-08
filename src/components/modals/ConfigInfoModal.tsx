import React, { useState } from "react";
import {
  Settings,
  Shield,
  Database,
  X,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface ConfigInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner?: string;
  repo?: string;
  branch?: string;
  path?: string;
  sha?: string;
  isMock?: boolean;
  userEmail?: string;
}

export const ConfigInfoModal: React.FC<ConfigInfoModalProps> = ({
  isOpen,
  onClose,
  sha,
  isMock,
  userEmail,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const publicApiUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/public/moments`
      : "/api/public/moments";

  const handleCopyApi = () => {
    navigator.clipboard.writeText(publicApiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800/60">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                数据库与前台集成
              </h3>
              <p className="text-[11px] text-stone-400">
                Cloudflare D1 驱动与博客开放数据接口
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          {/* Public API for Frontend Blog (Highlight Card) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/30 space-y-2.5">
            <div className="font-medium text-stone-900 dark:text-stone-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                前台博客实时读取接口 (Public Moments API)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
                CORS 跨域开放
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
              你的前台博客（如 oblivion-dashboard）无需再等待 GitHub 编译重构，直接调用此接口即可获取最新发布的说说：
            </p>

            {/* API URL Copy row */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
              <input
                type="text"
                readOnly
                value={publicApiUrl}
                className="flex-1 bg-transparent font-mono text-[11px] text-indigo-600 dark:text-indigo-400 outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyApi}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] flex items-center gap-1 shrink-0 cursor-pointer transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick JS code snippet */}
            <div className="text-[10px] font-mono p-2.5 rounded-xl bg-stone-900 text-stone-300 space-y-1">
              <div className="text-stone-400 flex items-center gap-1 font-sans">
                <Code2 className="w-3 h-3 text-indigo-400" /> 前台代码调用示例：
              </div>
              <p className="text-indigo-300">
                const moments = await fetch(&quot;{publicApiUrl}&quot;).then(r =&gt; r.json());
              </p>
            </div>
          </div>

          {/* Cloudflare D1 Database Status */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
            <div className="font-medium text-stone-900 dark:text-stone-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-500" />
                数据储存引擎 (Cloudflare D1)
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  isMock
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/60"
                    : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/60"
                }`}
              >
                {isMock ? "本地内存模拟" : "D1 生产数据库"}
              </span>
            </div>
            <div className="space-y-1 font-mono text-stone-600 dark:text-stone-400 text-[11px]">
              <div>数据表: articles (SQLite)</div>
              <div>当前修订: {sha || "初始版本"}</div>
              <div>绑定名称: env.DB</div>
            </div>
          </div>

          {/* Cloudflare Access */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <div className="font-medium text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-500" />
              后台安全策略 (Zero Trust Access)
            </div>
            <div className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
              当前操作会话: <span className="font-mono text-indigo-600 dark:text-indigo-400">{userEmail || "已验证"}</span>
              <p className="mt-1">
                写权限受 Cloudflare Access 强鉴权保护；前台读取接口已开放公开只读。
              </p>
            </div>
          </div>
        </div>

        {/* Footer action */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl cursor-pointer transition-all active:scale-95 shadow-md shadow-indigo-600/20"
          >
            完成并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
