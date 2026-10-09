import * as S from './LoginPage.styles';
import React, { useState, useEffect } from "react";
import { loginWithCloudflareAccess, checkAuthStatus } from "../../lib/api/client";


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
    <S.Div>
      {/* Ambient background glows */}
      <S.Div2 />
      <S.Div3 />

      {/* Main Login Card */}
      <S.Div4>
        <S.Div5>
          {/* Header */}
          <S.Div6>
            <S.Div7>
              <S.PenTool />
            </S.Div7>

            <div>
              <S.H1>
                <span>Oblivion-CMS</span>
                <S.Span>
                  Zero Trust
                </S.Span>
              </S.H1>
              <S.P>
                本站点受 Cloudflare Access 零信任策略保护
              </S.P>
            </div>
          </S.Div6>

          {/* Status info box */}
          <S.Div8>
            <S.Div9>
              <S.ShieldCheck />
              <span>当前状态：等待身份凭证验证</span>
            </S.Div9>
            <S.P2>
              需通过 Cloudflare Access（邮箱验证码或 SSO 登录）验证身份后方可进入 CMS 编辑器。
            </S.P2>
          </S.Div8>

          {/* Error Banner */}
          {errorMsg && (
            <S.Div10>
              <S.Div11>
                <S.AlertCircle />
                <S.Span2>{errorMsg}</S.Span2>
              </S.Div11>
              {isConfigError && (
                <S.Div12>
                  <S.P3>
                    <S.KeyRound /> 环境变量排查建议：
                  </S.P3>
                  <p>1. 检查 Cloudflare Pages 控制台设置中的环境变量</p>
                  <p>2. 确保在 Settings &rarr; Environment variables 中配置了：</p>
                  <S.P4>&bull; CF_ACCESS_TEAM_DOMAIN</S.P4>
                  <S.P4>&bull; CF_ACCESS_AUD</S.P4>
                </S.Div12>
              )}
            </S.Div10>
          )}

          {/* Action Buttons */}
          <S.Div13>
            <S.Button
              type="button"
              onClick={handleAccessLogin}
              disabled={isLoading}

            >
              {isLoading ? (
                <S.Div14 />
              ) : (
                <S.Cloud />
              )}
              <span>
                {isLocalHost
                  ? "一键进入本地模拟模式 (Local Mock)"
                  : "通过 Cloudflare Access 验证登录"}
              </span>
              <S.ArrowRight />
            </S.Button>

            {!isLocalHost && (
              <S.Button2
                type="button"
                onClick={handleRetryCheck}
                disabled={isLoading}

              >
                <S.RotateCcw />
                <span>重新检测当前会话 (Retry)</span>
              </S.Button2>
            )}

            {isLocalHost && (
              <S.Div15>
                <S.Span3>
                  <S.Terminal />
                  检测到本地 localhost 环境，支持离线模拟登录
                </S.Span3>
              </S.Div15>
            )}
          </S.Div13>
        </S.Div5>

        {/* Footer info */}
        <S.Div16>
          <S.Lock />
          <span>服务端实时验证 Cloudflare Access 官方 JWKS 证书</span>
        </S.Div16>
      </S.Div4>
    </S.Div>
  );
};
