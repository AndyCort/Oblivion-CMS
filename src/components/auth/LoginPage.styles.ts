import styled from "styled-components";
import { primaryButton, ghostButton } from "../../styles/workspace";

export const PageWrap = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--bg-app);
  color: var(--text);
`;

export const Card = styled.div`
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--bg-surface);
  padding: 28px;
  box-shadow: 0 20px 45px -12px rgb(0 0 0 / 0.18);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Header = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const LogoBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px -4px var(--accent-ring);
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
`;

export const Badge = styled.span`
  border-radius: 9999px;
  padding: 2px 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  background: var(--accent-soft);
  color: var(--accent-text);
`;

export const Subtitle = styled.p`
  font-size: 12px;
  color: var(--text-muted);
`;

export const ErrorBox = styled.div`
  border-radius: 12px;
  border: 1px solid var(--danger);
  background: var(--danger-soft);
  padding: 10px 12px;
  font-size: 12px;
  color: var(--danger);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ErrorHead = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-weight: 500;
`;

export const EnvHint = styled.div`
  padding-top: 6px;
  border-top: 1px solid rgb(244 63 94 / 0.25);
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PrimaryBtn = styled.button`
  ${primaryButton};
  width: 100%;
  height: 40px;
  border-radius: 12px;
  font-size: 13px;
`;

export const SecondaryBtn = styled.button`
  ${ghostButton};
  width: 100%;
  height: 36px;
  border-radius: 10px;
`;

export const FooterNote = styled.p`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
`;
