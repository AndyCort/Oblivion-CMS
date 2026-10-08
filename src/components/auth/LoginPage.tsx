import React, { useState } from "react";
import { loginWithPassword } from "../../lib/api/client";
import {
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  KeyRound,
  AlertCircle,
  PenTool,
} from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  onLoginError?: (error: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("请输入管理员密码");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginWithPassword(password.trim());
      if (res.success) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "登录失败，密码不正确");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevQuickLogin = () => {
    setPassword("admin");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-stone-950 text-stone-100 relative overflow-hidden select-none font-sans">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-3xl border border-stone-800/80 bg-stone-900/70 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl shadow-black/80 space-y-7">
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-4 ring-indigo-500/10">
              <PenTool className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                <span>Oblivion-CMS</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 font-normal">
                  管理后台
                </span>
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                请输入管理员访问密码以解锁文章可视化编辑器
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2 animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <label className="font-medium flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  <span>访问密码</span>
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入管理员密码..."
                  autoFocus
                  required
                  className="w-full text-sm py-3 pl-4 pr-11 rounded-xl border border-stone-800 bg-stone-950/80 text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-stone-500 hover:text-stone-300 transition-colors"
                  title={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>正在验证...</span>
              ) : (
                <>
                  <span>进入编辑器</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Local development quick fill tip */}
          <div className="pt-2 border-t border-stone-800/60 text-center">
            <p className="text-[11px] text-stone-500 leading-relaxed">
              本地开发环境默认密码为{" "}
              <button
                type="button"
                onClick={handleDevQuickLogin}
                className="font-mono text-indigo-400 underline underline-offset-2 hover:text-indigo-300"
              >
                admin
              </button>
              ；线上部署请在 Pages 环境变量中配置{" "}
              <span className="font-mono text-stone-400">ADMIN_PASSWORD</span>
            </p>
          </div>
        </div>

        {/* Security badge at bottom */}
        <div className="flex items-center justify-center gap-2 mt-5 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>受 Cloudflare Workers 运行时与 JWT 证书加密保护</span>
        </div>
      </div>
    </div>
  );
};
