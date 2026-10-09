import * as S from './ConflictResolutionModal.styles';
import React, { useState } from "react";

import type { Article } from "../../types/article";

interface ConflictResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReloadRemote: () => void;
  onForcePublish: () => void;
  localArticle: Article;
  remoteSha?: string;
  clientBaseSha?: string;
  isPublishing?: boolean;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  isOpen,
  onClose,
  onReloadRemote,
  onForcePublish,
  localArticle,
  remoteSha,
  clientBaseSha,
  isPublishing = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(JSON.stringify(localArticle, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <S.Div>
      <S.Div2>
        <S.Div3>
          <S.Div4>
            <S.AlertCircle />
          </S.Div4>
          <S.Div5>
            <S.H3>
              检测到远程发布冲突 (409 Conflict)
            </S.H3>
            <S.P>
              在您编辑期间，数据库中的文章数据版本与您编辑基准不一致。您的本地草稿已妥善保存在当前浏览器中。您可以拉取最新数据，或以当前草稿强制覆盖发布。
            </S.P>
          </S.Div5>
          <S.Button
            type="button"
            onClick={onClose}

          >
            <S.X />
          </S.Button>
        </S.Div3>

        <S.Div6>
          <div>客户端基准版本: {clientBaseSha?.slice(0, 16) || "未知"}</div>
          <div>远程最新版本: {remoteSha?.slice(0, 16) || "已更新"}</div>
        </S.Div6>

        <S.Div7>
          <S.Button2
            type="button"
            onClick={handleCopyDraft}

          >
            {copied ? <S.Check /> : <S.Copy />}
            {copied ? "已复制本地草稿" : "复制草稿 JSON 备份"}
          </S.Button2>

          <S.Div8>
            <S.Button3
              type="button"
              disabled={isPublishing}
              onClick={onClose}

            >
              稍后处理
            </S.Button3>
            <S.Button4
              type="button"
              disabled={isPublishing}
              onClick={onReloadRemote}

            >
              <S.RefreshCw />
              拉取最新远程数据
            </S.Button4>
            <S.Button5
              type="button"
              disabled={isPublishing}
              onClick={onForcePublish}

            >
              <S.UploadCloud />
              {isPublishing ? "正在覆盖..." : "强制覆盖发布"}
            </S.Button5>
          </S.Div8>
        </S.Div7>
      </S.Div2>
    </S.Div>
  );
};
