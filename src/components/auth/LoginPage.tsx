import * as S from "./LoginPage.styles";
import React, { useState, useEffect, useMemo } from "react";
import { loginWithCloudflareAccess, checkAuthStatus } from "../../lib/api/client";
import {
  loadCmsSettings,
  applySiteBrand,
  applyThemeAndAccent,
} from "../../lib/settings/cmsSettings";

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  initialError?: string | null;
  onRetry?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  initialError,
  onRetry,
}) => {
  const brand = useMemo(() => loadCmsSettings(), []);
  const [iconError, setIconError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError || null);

  useEffect(() => {
    applySiteBrand(brand);
    applyThemeAndAccent(brand);
  }, [brand]);

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
    <S.PageWrap>
      <S.GlowPrimary />
      <S.GlowSecondary />

      <S.CardContainer>
        <S.Card>
          <S.HeaderSection>
            <S.LogoBox>
              {brand.siteIcon && !iconError ? (
                <S.BrandImg
                  src={brand.siteIcon}
                  alt={brand.siteName}
                  onError={() => setIconError(true)}
                />
              ) : (
                <S.PenTool />
              )}
            </S.LogoBox>

            <div>
              <S.Title>
                <span>{brand.siteName}</span>
                <S.Badge>Zero Trust</S.Badge>
              </S.Title>
              <S.Subtitle>本站点受 Cloudflare Access 零信任策略保护</S.Subtitle>
            </div>
          </S.HeaderSection>

          <S.StatusBox>
            <S.StatusTitle>
              <S.ShieldCheck />
              <span>当前状态：等待身份凭证验证</span>
            </S.StatusTitle>
            <S.StatusDesc>
              请通过 Cloudflare Access 验证身份。可在 Access 登录页选择已启用的邮箱验证码、SSO 或 Passkey 通行密钥。
            </S.StatusDesc>
          </S.StatusBox>

          {errorMsg && (
            <S.ErrorBox role="alert">
              <S.ErrorHeader>
                <S.AlertCircle />
                <S.ErrorText>{errorMsg}</S.ErrorText>
              </S.ErrorHeader>
              {isConfigError && (
                <S.TroubleshootingBox>
                  <S.TroubleshootingTitle>
                    <S.KeyRound /> 环境变量排查建议：
                  </S.TroubleshootingTitle>
                  <p>1. 检查 Cloudflare Pages 控制台设置中的环境变量</p>
                  <p>2. 确保在 Settings &rarr; Environment variables 中配置了：</p>
                  <S.EnvKeyLine>&bull; CF_ACCESS_TEAM_DOMAIN</S.EnvKeyLine>
                  <S.EnvKeyLine>&bull; CF_ACCESS_AUD</S.EnvKeyLine>
                </S.TroubleshootingBox>
              )}
            </S.ErrorBox>
          )}

          <S.ActionsSection>
            <S.PrimaryBtn
              type="button"
              onClick={handleAccessLogin}
              disabled={isLoading}
            >
              {isLoading ? <S.Spinner /> : <S.Cloud />}
              <span>
                {isLocalHost
                  ? "一键进入本地模拟模式 (Local Mock)"
                  : "通过 Cloudflare Access 验证登录"}
              </span>
              <S.ArrowRight />
            </S.PrimaryBtn>

            {!isLocalHost && (
              <>
                <S.PasskeyHint>
                  使用 Passkey：进入 Access 登录页后选择「Sign in with a passkey」。
                  首次使用可选择「Don't have a passkey? Set one up」，验证身份后绑定。
                  若未显示该选项，需要管理员在 Access 中启用 Passkeys 登录方式。
                </S.PasskeyHint>
                <S.SecondaryBtn
                  type="button"
                  onClick={handleRetryCheck}
                  disabled={isLoading}
                >
                  <S.RotateCcw />
                  <span>重新检测当前会话 (Retry)</span>
                </S.SecondaryBtn>
              </>
            )}

            {isLocalHost && (
              <S.LocalHintWrap>
                <S.LocalHintBadge>
                  <S.Terminal />
                  检测到本地 localhost 环境，支持离线模拟登录
                </S.LocalHintBadge>
              </S.LocalHintWrap>
            )}
          </S.ActionsSection>
        </S.Card>

        <S.FooterNote>
          <S.Lock />
          <span>服务端实时验证 Cloudflare Access 官方 JWKS 证书</span>
        </S.FooterNote>
      </S.CardContainer>
    </S.PageWrap>
  );
};
