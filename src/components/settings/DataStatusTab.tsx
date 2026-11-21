import * as S from "./SettingsModal.styles";
import { useEffect, useState } from "react";
import { Check, Copy, Download, LogOut, Trash2 } from "lucide-react";
import { fetchMoments } from "../../lib/api/client";
import {
  deleteDraft,
  deletePostDraft,
  getAllDrafts,
  getPostDrafts,
} from "../../lib/storage/draftStore";
import { downloadJsonFile } from "../../lib/utils";
import type { ArticleDraft } from "../../types/article";
import type { PostDraft } from "../../types/post";

interface DataStatusTabProps {
  isOpen: boolean;
  onDraftsChanged: () => void;
  onToast: (type: "success" | "error" | "info", text: string) => void;
  onClose: () => void;
  onLogout: () => Promise<void>;
  isD1: boolean;
  userEmail?: string;
}

export function DataStatusTab({
  isOpen,
  onDraftsChanged,
  onToast,
  onClose,
  onLogout,
  isD1,
  userEmail,
}: DataStatusTabProps) {
  const [momentDrafts, setMomentDrafts] = useState<ArticleDraft[]>([]);
  const [postDrafts, setPostDrafts] = useState<PostDraft[]>([]);
  const [copiedApi, setCopiedApi] = useState(false);
  const [exporting, setExporting] = useState(false);

  const loadDrafts = async () => {
    try {
      const [m, p] = await Promise.all([getAllDrafts(), getPostDrafts()]);
      setMomentDrafts(m);
      setPostDrafts(p);
    } catch {
      /* indexedDB unavailable */
    }
  };

  useEffect(() => {
    if (isOpen) void loadDrafts();
  }, [isOpen]);

  const handleExportMoments = async () => {
    setExporting(true);
    try {
      const data = await fetchMoments();
      const day = new Date().toISOString().slice(0, 10);
      downloadJsonFile(`moments-backup-${day}.json`, data.moments);
      onToast("success", `已导出 ${data.moments.length} 条说说备份`);
    } catch (err: any) {
      onToast("error", `导出失败: ${err?.message || "未知错误"}`);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteDraft = async (kind: "moment" | "post", id: string) => {
    if (kind === "moment") await deleteDraft(id);
    else await deletePostDraft(id);
    await loadDrafts();
    onDraftsChanged();
    onToast("info", "已删除本地草稿");
  };

  const handleClearDrafts = async (kind: "moment" | "post") => {
    if (kind === "moment") {
      for (const d of momentDrafts) await deleteDraft(d.id);
    } else {
      for (const d of postDrafts) await deletePostDraft(d.id);
    }
    await loadDrafts();
    onDraftsChanged();
    onToast("info", `已清空${kind === "moment" ? "说说" : "博客"}本地草稿`);
  };

  const publicApiUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/public/moments`
      : "/api/public/moments";

  return (
    <>
      <S.Card>
        <S.CardHeader>
          <span>本地草稿 ({momentDrafts.length + postDrafts.length})</span>
          <S.RowControl>
            <S.SmallBtn
              type="button"
              disabled={!momentDrafts.length}
              onClick={() => void handleClearDrafts("moment")}
            >
              清空说说 ({momentDrafts.length})
            </S.SmallBtn>
            <S.SmallBtn
              type="button"
              disabled={!postDrafts.length}
              onClick={() => void handleClearDrafts("post")}
            >
              清空博客 ({postDrafts.length})
            </S.SmallBtn>
          </S.RowControl>
        </S.CardHeader>
        {momentDrafts.length === 0 && postDrafts.length === 0 ? (
          <S.Row>
            <S.RowLabel>
              <span>暂无未发布的本机草稿</span>
            </S.RowLabel>
          </S.Row>
        ) : (
          <S.DraftList>
            {momentDrafts.map((d) => (
              <S.DraftRow key={`m-${d.id}`}>
                <S.RowControl style={{ minWidth: 0, flex: 1 }}>
                  <S.DraftKind $kind="moment">说说</S.DraftKind>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {d.article.content.trim() || "（无文本说说草稿）"}
                  </span>
                </S.RowControl>
                <S.SmallBtn
                  type="button"
                  aria-label={`删除说说草稿 ${d.id}`}
                  onClick={() => void handleDeleteDraft("moment", d.id)}
                >
                  <Trash2 size={12} />
                </S.SmallBtn>
              </S.DraftRow>
            ))}
            {postDrafts.map((d) => (
              <S.DraftRow key={`p-${d.id}`}>
                <S.RowControl style={{ minWidth: 0, flex: 1 }}>
                  <S.DraftKind $kind="post">博客</S.DraftKind>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {d.post.title || "未命名博客草稿"}
                  </span>
                </S.RowControl>
                <S.SmallBtn
                  type="button"
                  aria-label={`删除博客草稿 ${d.id}`}
                  onClick={() => void handleDeleteDraft("post", d.id)}
                >
                  <Trash2 size={12} />
                </S.SmallBtn>
              </S.DraftRow>
            ))}
          </S.DraftList>
        )}
      </S.Card>

      <S.Card>
        <S.CardHeader>备份与运行状态</S.CardHeader>
        <S.Row>
          <S.RowLabel>
            <strong>导出说说 JSON 备份</strong>
            <span>下载云端全部说说数据到本地</span>
          </S.RowLabel>
          <S.SmallBtn
            type="button"
            disabled={exporting}
            onClick={() => void handleExportMoments()}
          >
            <Download size={12} />
            {exporting ? "导出中…" : "导出备份"}
          </S.SmallBtn>
        </S.Row>
        <S.Row>
          <S.RowLabel>
            <strong>
              数据连接：{isD1 ? "Cloudflare D1 已联机" : "未连接 Cloudflare D1"}
            </strong>
            <span>当前账号：{userEmail || "已验证会话"}</span>
          </S.RowLabel>
          <S.RowControl>
            <S.SmallBtn
              type="button"
              title={publicApiUrl}
              onClick={() => {
                void navigator.clipboard.writeText(publicApiUrl);
                setCopiedApi(true);
                setTimeout(() => setCopiedApi(false), 2000);
              }}
            >
              {copiedApi ? <Check size={12} /> : <Copy size={12} />}
              {copiedApi ? "已复制 API" : "复制 Public API"}
            </S.SmallBtn>
            <S.SmallBtn
              type="button"
              $tone="danger"
              onClick={() => {
                onClose();
                void onLogout();
              }}
            >
              <LogOut size={12} />
              退出登录
            </S.SmallBtn>
          </S.RowControl>
        </S.Row>
      </S.Card>
    </>
  );
}
