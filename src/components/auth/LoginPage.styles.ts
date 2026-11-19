import styled from "styled-components";
import {
  PenTool as BasePenTool,
  ShieldCheck as BaseShieldCheck,
  AlertCircle as BaseAlertCircle,
  KeyRound as BaseKeyRound,
  Cloud as BaseCloud,
  ArrowRight as BaseArrowRight,
  RotateCcw as BaseRotateCcw,
  Terminal as BaseTerminal,
  Lock as BaseLock,
} from "lucide-react";

export const PageWrap = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--color-stone-950);
  padding: calc(var(--spacing) * 6) calc(var(--spacing) * 4);
  padding-top: max(0.75rem, env(safe-area-inset-top, 0px));
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom, 0px));
  font-family: var(--font-sans);
  color: var(--color-stone-100);
  user-select: none;
`;

export const GlowPrimary = styled.div`
  pointer-events: none;
  position: absolute;
  top: 25%;
  left: 50%;
  height: 550px;
  width: 550px;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background-image: linear-gradient(
    to top right in oklab,
    color-mix(in oklab, var(--color-indigo-600) 20%, transparent),
    color-mix(in oklab, var(--color-purple-600) 15%, transparent),
    transparent
  );
  filter: blur(130px);
`;

export const GlowSecondary = styled.div`
  pointer-events: none;
  position: absolute;
  right: 25%;
  bottom: 25%;
  height: 350px;
  width: 350px;
  border-radius: 9999px;
  background-color: color-mix(in oklab, var(--color-indigo-500) 10%, transparent);
  filter: blur(100px);
`;

export const CardContainer = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: var(--container-md);
  transition-duration: 300ms;
`;

export const Card = styled.div`
  border-radius: var(--radius-3xl);
  border: 1px solid color-mix(in oklab, var(--color-stone-800) 80%, transparent);
  background-color: color-mix(in oklab, var(--color-stone-900) 70%, transparent);
  padding: calc(var(--spacing) * 5);
  box-shadow: 0 25px 50px -12px color-mix(in oklab, var(--color-black) 80%, transparent);
  backdrop-filter: blur(var(--blur-2xl));
  -webkit-backdrop-filter: blur(var(--blur-2xl));

  & > :not(:last-child) {
    margin-bottom: calc(var(--spacing) * 6);
  }

  @media (width >= 40rem) {
    padding: calc(var(--spacing) * 8);
    & > :not(:last-child) {
      margin-bottom: calc(var(--spacing) * 7);
    }
  }
`;

export const HeaderSection = styled.div`
  text-align: center;
  & > :not(:last-child) {
    margin-bottom: calc(var(--spacing) * 3);
  }
`;

export const LogoBox = styled.div`
  margin-inline: auto;
  display: flex;
  height: calc(var(--spacing) * 14);
  width: calc(var(--spacing) * 14);
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-2xl);
  background-image: linear-gradient(
    to top right in oklab,
    var(--color-indigo-600),
    var(--color-indigo-500),
    var(--color-purple-500)
  );
  color: var(--color-white);
  box-shadow:
    0 10px 15px -3px color-mix(in oklab, var(--color-indigo-500) 25%, transparent),
    0 0 0 4px color-mix(in oklab, var(--color-indigo-500) 10%, transparent);
`;

export const BrandImg = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 6px;
  object-fit: cover;
`;

export const PenTool = styled(BasePenTool)`
  height: calc(var(--spacing) * 7);
  width: calc(var(--spacing) * 7);
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(var(--spacing) * 2);
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-tight);
  color: var(--color-white);

  @media (width >= 40rem) {
    font-size: var(--text-2xl);
    line-height: var(--text-2xl--line-height);
  }
`;

export const Badge = styled.span`
  border-radius: 9999px;
  border: 1px solid color-mix(in oklab, var(--color-indigo-800) 60%, transparent);
  background-color: color-mix(in oklab, var(--color-indigo-950) 80%, transparent);
  padding: calc(var(--spacing) * 0.5) calc(var(--spacing) * 2);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: var(--font-weight-normal);
  color: var(--color-indigo-400);
`;

export const Subtitle = styled.p`
  margin-top: var(--spacing);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-400);
`;

export const StatusBox = styled.div`
  border-radius: var(--radius-2xl);
  border: 1px solid color-mix(in oklab, var(--color-stone-800) 80%, transparent);
  background-color: color-mix(in oklab, var(--color-stone-950) 70%, transparent);
  padding: calc(var(--spacing) * 4);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-400);

  & > :not(:last-child) {
    margin-bottom: calc(var(--spacing) * 2.5);
  }
`;

export const StatusTitle = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 2);
  font-weight: var(--font-weight-medium);
  color: var(--color-stone-200);
`;

export const ShieldCheck = styled(BaseShieldCheck)`
  height: calc(var(--spacing) * 4);
  width: calc(var(--spacing) * 4);
  flex-shrink: 0;
  color: var(--color-emerald-400);
`;

export const StatusDesc = styled.p`
  font-size: 11px;
  line-height: var(--leading-relaxed);
  color: var(--color-stone-400);
`;

export const ErrorBox = styled.div`
  border-radius: var(--radius-xl);
  border: 1px solid color-mix(in oklab, var(--color-rose-800) 60%, transparent);
  background-color: color-mix(in oklab, var(--color-rose-950) 60%, transparent);
  padding: calc(var(--spacing) * 3.5);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-rose-300);
  transition-duration: 200ms;

  & > :not(:last-child) {
    margin-bottom: calc(var(--spacing) * 2);
  }
`;

export const ErrorHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: calc(var(--spacing) * 2);
`;

export const AlertCircle = styled(BaseAlertCircle)`
  margin-top: calc(var(--spacing) * 0.5);
  height: calc(var(--spacing) * 4);
  width: calc(var(--spacing) * 4);
  flex-shrink: 0;
  color: var(--color-rose-400);
`;

export const ErrorText = styled.span`
  font-weight: var(--font-weight-medium);
`;

export const TroubleshootingBox = styled.div`
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in oklab, var(--color-rose-900) 50%, transparent);
  background-color: color-mix(in oklab, var(--color-rose-950) 40%, transparent);
  padding: calc(var(--spacing) * 2.5);
  font-family: var(--font-mono);
  font-size: 11px;
  color: color-mix(in oklab, var(--color-rose-300) 80%, transparent);

  & > :not(:last-child) {
    margin-bottom: var(--spacing);
  }
`;

export const TroubleshootingTitle = styled.p`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 1.5);
  font-weight: var(--font-weight-semibold);
  color: var(--color-rose-200);
`;

export const KeyRound = styled(BaseKeyRound)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
`;

export const EnvKeyLine = styled.p`
  color: var(--color-rose-100);
`;

export const ActionsSection = styled.div`
  & > :not(:last-child) {
    margin-bottom: calc(var(--spacing) * 3);
  }
`;

export const PasskeyHint = styled.p`
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-stone-300);
`;

export const PrimaryBtn = styled.button`
  display: flex;
  width: 100%;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: calc(var(--spacing) * 2);
  border-radius: var(--radius-xl);
  background-color: var(--color-indigo-600);
  padding: calc(var(--spacing) * 3.5) calc(var(--spacing) * 4);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  box-shadow: 0 10px 15px -3px color-mix(in oklab, var(--color-indigo-600) 25%, transparent);
  transition: all var(--default-transition-duration) var(--default-transition-timing-function);

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-indigo-500);
    }
  }
  &:active {
    scale: 0.98;
  }
  &:disabled {
    opacity: 0.5;
  }
`;

export const Spinner = styled.div`
  height: calc(var(--spacing) * 4);
  width: calc(var(--spacing) * 4);
  animation: spin 1s linear infinite;
  border-radius: 9999px;
  border: 2px solid var(--color-white);
  border-top-color: transparent;
`;

export const Cloud = styled(BaseCloud)`
  height: calc(var(--spacing) * 4);
  width: calc(var(--spacing) * 4);
`;

export const ArrowRight = styled(BaseArrowRight)`
  height: calc(var(--spacing) * 4);
  width: calc(var(--spacing) * 4);
`;

export const SecondaryBtn = styled.button`
  display: flex;
  width: 100%;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: calc(var(--spacing) * 2);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-stone-800);
  background-color: color-mix(in oklab, var(--color-stone-900) 60%, transparent);
  padding: calc(var(--spacing) * 2.5) calc(var(--spacing) * 4);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  font-weight: var(--font-weight-medium);
  color: var(--color-stone-400);
  transition: all var(--default-transition-duration) var(--default-transition-timing-function);

  @media (hover: hover) {
    &:hover {
      background-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
      color: var(--color-stone-200);
    }
  }
`;

export const RotateCcw = styled(BaseRotateCcw)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
`;

export const LocalHintWrap = styled.div`
  padding-top: var(--spacing);
  text-align: center;
`;

export const LocalHintBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: calc(var(--spacing) * 1.5);
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in oklab, var(--color-amber-800) 60%, transparent);
  background-color: color-mix(in oklab, var(--color-amber-950) 60%, transparent);
  padding: var(--spacing) calc(var(--spacing) * 2.5);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-amber-300);
`;

export const Terminal = styled(BaseTerminal)`
  height: calc(var(--spacing) * 3);
  width: calc(var(--spacing) * 3);
`;

export const FooterNote = styled.div`
  margin-top: calc(var(--spacing) * 5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(var(--spacing) * 2);
  font-size: 11px;
  color: var(--color-stone-500);
`;

export const Lock = styled(BaseLock)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
  color: var(--color-indigo-400);
`;
