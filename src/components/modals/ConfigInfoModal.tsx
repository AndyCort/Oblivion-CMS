import { Settings, Shield, GitBranch, Database, X, ExternalLink } from "lucide-react";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

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
  owner,
  repo,
  branch,
  path,
  sha,
  isMock,
  userEmail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
              Oblivion-CMS 系统与配置状态
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          {/* GitHub Data Source */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
            <div className="font-medium text-stone-900 dark:text-stone-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GithubIcon className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                数据源 (GitHub 仓库)
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  isMock
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/60"
                    : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/60"
                }`}
              >
                {isMock ? "本地/模拟数据源" : "GitHub API 联机"}
              </span>
            </div>
            <div className="space-y-1 font-mono text-stone-600 dark:text-stone-400 text-[11px]">
              <div>仓库: {owner}/{repo}</div>
              <div>分支: {branch || "main"}</div>
              <div>文件: {path || "src/components/data/moments.ts"}</div>
              <div>最新 SHA: {sha?.slice(0, 12)}...</div>
            </div>
          </div>

          {/* Cloudflare Access */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
            <div className="font-medium text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-500" />
              身份验证 (Cloudflare Access)
            </div>
            <div className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
              当前用户: <span className="font-mono text-indigo-600 dark:text-indigo-400">{userEmail || "未登录"}</span>
              <p className="mt-1">
                生产环境通过 Cloudflare Access JWT 服务端验签保障安全。GitHub Token 仅保存在 Cloudflare Secrets 中。
              </p>
            </div>
          </div>

          {/* Local Drafts info */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <div className="font-medium text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-500" />
              本地草稿存储 (IndexedDB)
            </div>
            <div className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
              未发布草稿实时保存在本机的浏览器 IndexedDB 中（防抖自动保存）。仅在点击“发布文章”时才会向 GitHub 发起 Commit。
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
          >
            了解并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
