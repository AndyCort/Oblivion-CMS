import * as S from "./SettingsModal.styles";
import { useEffect, useState } from "react";
import { Database, Palette, RotateCcw, Settings } from "lucide-react";
import type { CmsSettings } from "../../lib/settings/cmsSettings";
import { BaseModal, ModalButton } from "../workspace/BaseModal";
import { DataStatusTab } from "./DataStatusTab";
import { PreferencesTab } from "./PreferencesTab";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CmsSettings;
  onUpdateSettings: (patch: Partial<CmsSettings>) => void;
  onResetSettings: () => void;
  onDraftsChanged: () => void;
  onToast: (type: "success" | "error" | "info", text: string) => void;
  onLogout: () => Promise<void>;
  isD1: boolean;
  userEmail?: string;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
  onDraftsChanged,
  onToast,
  onLogout,
  isD1,
  userEmail,
}: SettingsModalProps) {
  const [tab, setTab] = useState<"preferences" | "data">("preferences");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (isOpen) setConfirmReset(false);
  }, [isOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="CMS 设置中心"
      subtitle="偏好实时保存至当前浏览器"
      icon={<Settings size={16} />}
      maxWidth="680px"
      height="min(600px, calc(100dvh - 24px))"
      footer={
        <>
          <div style={{ marginRight: "auto", display: "flex", gap: 6 }}>
            {confirmReset ? (
              <>
                <ModalButton
                  type="button"
                  $tone="danger"
                  onClick={() => {
                    onResetSettings();
                    setConfirmReset(false);
                  }}
                >
                  确认恢复默认
                </ModalButton>
                <ModalButton type="button" onClick={() => setConfirmReset(false)}>
                  取消
                </ModalButton>
              </>
            ) : (
              <ModalButton type="button" onClick={() => setConfirmReset(true)}>
                <RotateCcw size={13} />
                恢复默认设置
              </ModalButton>
            )}
          </div>
          <ModalButton type="button" $tone="primary" onClick={onClose}>
            完成
          </ModalButton>
        </>
      }
    >
      <S.TabBar role="tablist">
        <S.TabBtn
          type="button"
          role="tab"
          aria-selected={tab === "preferences"}
          $active={tab === "preferences"}
          onClick={() => setTab("preferences")}
        >
          <Palette size={13} />
          偏好设置
        </S.TabBtn>
        <S.TabBtn
          type="button"
          role="tab"
          aria-selected={tab === "data"}
          $active={tab === "data"}
          onClick={() => setTab("data")}
        >
          <Database size={13} />
          草稿与状态
        </S.TabBtn>
      </S.TabBar>

      {tab === "preferences" ? (
        <PreferencesTab
          settings={settings}
          onUpdateSettings={onUpdateSettings}
        />
      ) : (
        <DataStatusTab
          isOpen={isOpen}
          onDraftsChanged={onDraftsChanged}
          onToast={onToast}
          onClose={onClose}
          onLogout={onLogout}
          isD1={isD1}
          userEmail={userEmail}
        />
      )}
    </BaseModal>
  );
}
