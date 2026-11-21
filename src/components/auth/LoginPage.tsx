import * as S from "./LoginPage.styles";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Cloud,
  Lock,
  PenTool,
  RotateCcw,
} from "lucide-react";
import {
  checkAuthStatus,
  loginWithCloudflareAccess,
  type UserSession,
} from "../../lib/api/client";
import {
  applyThemeAndAccent,
  loadCmsSettings,
} from "../../lib/settings/cmsSettings";

interface LoginPageProps {
  onLoginSuccess: (user: UserSession, d1Bound?: boolean) => void;
  initialError?: string | null;
  onRetry?: () => void;
}

export function LoginPage({
  onLoginSuccess,
  initialError,
  onRetry,
}: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError || null);

  useEffect(() => {
    applyThemeAndAccent(loadCmsSettings());
  }, []);

  useEffect(() => {
    if (initialError) setErrorMsg(initialError);
  }, [initialError]);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginWithCloudflareAccess();
      if (user) onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err?.message || "登录请求失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (onRetry) {
        onRetry();
        return;
      }
      const res = await checkAuthStatus();
      if (res.user) onLoginSuccess(res.user, res.d1Bound);
      else if (res.error) setErrorMsg(res.error);
    } catch (err: any) {
      setErrorMsg(err?.message || "检查会话失败");
    } finally {
      setIsLoading(false);
    }
  };

  const isConfigError =
    errorMsg?.includes("CF_ACCESS_TEAM_DOMAIN") ||
    errorMsg?.includes("CF_ACCESS_AUD");

  return (
    <S.PageWrap>
      <S.Card>
        <S.Header>
          <S.LogoBox>
            <PenTool size={22} />
          </S.LogoBox>
          <div>
            <S.Title>
              <span>Oblivion-CMS</span>
              <S.Badge>Zero Trust</S.Badge>
            </S.Title>
            <S.Subtitle>受 Cloudflare Access 零信任策略保护</S.Subtitle>
          </div>
        </S.Header>

        {errorMsg && (
          <S.ErrorBox role="alert">
            <S.ErrorHead>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{errorMsg}</span>
            </S.ErrorHead>
            {isConfigError && (
              <S.EnvHint>
                请在 Cloudflare Pages 环境变量中配置 CF_ACCESS_TEAM_DOMAIN 与
                CF_ACCESS_AUD
              </S.EnvHint>
            )}
          </S.ErrorBox>
        )}

        <S.Actions>
          <S.PrimaryBtn
            type="button"
            onClick={() => void handleLogin()}
            disabled={isLoading}
          >
            <Cloud size={15} />
            <span>通过 Cloudflare Access 登录</span>
            <ArrowRight size={14} />
          </S.PrimaryBtn>

          <S.SecondaryBtn
            type="button"
            onClick={() => void handleRetry()}
            disabled={isLoading}
          >
            <RotateCcw size={13} />
            <span>重新检测会话</span>
          </S.SecondaryBtn>
        </S.Actions>
      </S.Card>

      <S.FooterNote>
        <Lock size={12} />
        <span>Cloudflare Access JWKS 服务端验签</span>
      </S.FooterNote>
    </S.PageWrap>
  );
}
