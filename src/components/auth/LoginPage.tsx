import React, { useState, useEffect } from "react";
import { loginWithCloudflareAccess, checkAuthStatus } from "../../lib/api/client";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  RotateCcw,
  PenTool,
  AlertCircle,
  Terminal,
  Cloud,
  KeyRound,
} from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  onLoginError?: (error: string) => void;
  initialError?: string | null;
  onRetry?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  initialError,
  onRetry,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError || null);

  useEffect(() => {
    if (initialError) {
      setErrorMsg(initialError);
    }
  }, [initialError]);

  const isLocalHost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  const handleAccessLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginWithCloudflareAccess();
      if (user) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "登录请求失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryCheck = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (onRetry) {
        onRetry();
        return;
      }
      const res = await checkAuthStatus();
      if (res.user) {
        onLoginSuccess(res.user);
      } else if (res.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "检查会话失败");
    } finally {
      setIsLoading(false);
    }
  };

  const isConfigError =
    errorMsg?.includes("CF_ACCESS_TEAM_DOMAIN") ||
    errorMsg?.includes("生产配置缺失") ||
    errorMsg?.includes("服务器错误");

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-stone-950 text-stone-100 relative overflow-hidden select-none font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-3xl border border-stone-800/80 bg-stone-900/70 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl shadow-black/80 space-y-7">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-4 ring-indigo-500/10">
              <PenTool className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                <span>Oblivion-CMS</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 font-normal">
                  Zero Trust
                </span>
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                本站点受 Cloudflare Access 零信任策略保护
              </p>
            </div>
          </div>

          {/* Status info box */}
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-2.5 text-xs text-stone-400">
            <div className="flex items-center gap-2 text-stone-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>当前状态：等待身份凭证验证</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-400">
              需通过 Cloudflare Access（邮箱验证码或 GitHub 登录）验证身份后方可进入 CMS 编辑器。
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 space-y-2 animate-in shake duration-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="font-medium">{errorMsg}</span>
              </div>
              {isConfigError && (
                <div className="text-[11px] text-rose-300/80 bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/50 space-y-1 font-mono">
                  <p className="font-semibold text-rose-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" /> 环境变量排查建议：
                  </p>
                  <p>1. 检查 Cloudflare Pages 控制台设置中的环境变量</p>
                  <p>2. 确保在 Settings &rarr; Environment variables 或 wrangler.toml 的 [vars] 下配置了：</p>
                  <p className="text-rose-100">&bull; CF_ACCESS_TEAM_DOMAIN</p>
                  <p className="text-rose-100">&bull; CF_ACCESS_AUD</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleAccessLogin}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              <span>
                {isLocalHost
                  ? "一键进入本地模拟模式 (Local Mock)"
                  : "通过 Cloudflare Access 验证登录"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!isLocalHost && (
              <button
                type="button"
                onClick={handleRetryCheck}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-stone-400 hover:text-stone-200 bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重新检测当前会话 (Retry)</span>
              </button>
            )}

            {isLocalHost && (
              <div className="text-center pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/60 text-[10px] text-amber-300 font-mono">
                  <Terminal className="w-3 h-3" />
                  检测到本地 localhost 环境，支持离线模拟登录
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-2 mt-5 text-[11px] text-stone-500">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>服务端实时验证 Cloudflare Access 官方 JWKS 证书</span>
        </div>
      </div>
    </div>
  );
};
