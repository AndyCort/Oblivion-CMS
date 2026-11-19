import * as S from "./SettingsModal.styles";
import { useEffect, useState } from "react";
import {
  ACCENT_PRESETS,
  DEFAULT_MOMENT_AVATAR,
  type AccentColorPreset,
  type CmsSettings,
} from "../../lib/settings/cmsSettings";
import { parseTagList } from "../../lib/utils";

const SHORTCUTS: [string, string][] = [
  ["展开 / 收起文章列表", "⌘ / Ctrl + B"],
  ["立即保存本地草稿", "⌘ / Ctrl + S"],
  ["发布当前内容", "⌘ / Ctrl + Enter"],
  ["Markdown 加粗 / 斜体 / 缩进", "⌘/Ctrl+B / I / Tab"],
];

interface PreferencesTabProps {
  settings: CmsSettings;
  onUpdateSettings: (patch: Partial<CmsSettings>) => void;
}

export function PreferencesTab({
  settings,
  onUpdateSettings,
}: PreferencesTabProps) {
  const [tagsInput, setTagsInput] = useState(
    settings.defaultMomentTags.join(", "),
  );

  useEffect(() => {
    if (
      parseTagList(tagsInput).join(",") !== settings.defaultMomentTags.join(",")
    ) {
      setTagsInput(settings.defaultMomentTags.join(", "));
    }
  }, [settings.defaultMomentTags]);

  return (
    <>
      <S.Card>
        <S.CardHeader>外观与工作区</S.CardHeader>
        <S.Row>
          <S.RowLabel>
            <strong>外观模式</strong>
            <span>与左侧导轨主题按钮实时同步</span>
          </S.RowLabel>
          <S.Segment>
            {(
              [
                ["light", "浅色"],
                ["dark", "深色"],
                ["system", "跟随系统"],
              ] as const
            ).map(([val, label]) => (
              <S.SegmentBtn
                key={val}
                type="button"
                $active={settings.theme === val}
                onClick={() => onUpdateSettings({ theme: val })}
              >
                {label}
              </S.SegmentBtn>
            ))}
          </S.Segment>
        </S.Row>

        <S.Row>
          <S.RowLabel>
            <strong>主题强调色</strong>
            <span>切换按钮、选中态与高亮色调</span>
          </S.RowLabel>
          <S.RowControl>
            {(Object.keys(ACCENT_PRESETS) as AccentColorPreset[]).map((key) => (
              <S.SwatchBtn
                key={key}
                type="button"
                $active={settings.accentColor === key}
                onClick={() => onUpdateSettings({ accentColor: key })}
              >
                <S.SwatchDot $color={ACCENT_PRESETS[key].swatch} />
                {ACCENT_PRESETS[key].label}
              </S.SwatchBtn>
            ))}
          </S.RowControl>
        </S.Row>

        <S.Row>
          <S.RowLabel>
            <strong>默认编辑视图与列表</strong>
            <span>控制启动后的视图布局与排序</span>
          </S.RowLabel>
          <S.RowControl>
            <S.Select
              aria-label="默认视图"
              value={settings.defaultView}
              onChange={(e) =>
                onUpdateSettings({
                  defaultView: e.target.value as CmsSettings["defaultView"],
                })
              }
            >
              <option value="edit">仅编辑</option>
              <option value="split">分屏</option>
              <option value="preview">仅预览</option>
            </S.Select>
            <S.Select
              aria-label="默认排序"
              value={settings.defaultSortOrder}
              onChange={(e) =>
                onUpdateSettings({
                  defaultSortOrder: e.target.value as "desc" | "asc",
                })
              }
            >
              <option value="desc">最新优先</option>
              <option value="asc">最早优先</option>
            </S.Select>
            <S.Toggle
              type="button"
              role="switch"
              aria-checked={settings.compactList}
              aria-label="紧凑列表"
              $checked={settings.compactList}
              onClick={() =>
                onUpdateSettings({ compactList: !settings.compactList })
              }
            >
              <span />
            </S.Toggle>
          </S.RowControl>
        </S.Row>
      </S.Card>

      <S.Card>
        <S.CardHeader>写作与预览</S.CardHeader>
        <S.Row>
          <S.RowLabel>
            <strong>字体与字号</strong>
            <span>应用于说说与博客正文编辑框</span>
          </S.RowLabel>
          <S.RowControl>
            <S.Select
              aria-label="编辑字体"
              value={settings.editorFontFamily}
              onChange={(e) =>
                onUpdateSettings({
                  editorFontFamily: e.target
                    .value as CmsSettings["editorFontFamily"],
                })
              }
            >
              <option value="default">默认</option>
              <option value="sans">无衬线</option>
              <option value="serif">衬线</option>
              <option value="mono">等宽</option>
            </S.Select>
            <S.Select
              aria-label="编辑字号"
              value={settings.editorFontSize}
              onChange={(e) =>
                onUpdateSettings({ editorFontSize: Number(e.target.value) })
              }
            >
              {[13, 14, 15, 16].map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </S.Select>
          </S.RowControl>
        </S.Row>

        <S.Row>
          <S.RowLabel>
            <strong>Tab 缩进与目录展开</strong>
            <span>Markdown 缩进空格及预览目录默认状态</span>
          </S.RowLabel>
          <S.RowControl>
            <S.Segment>
              {([2, 4] as const).map((spaces) => (
                <S.SegmentBtn
                  key={spaces}
                  type="button"
                  $active={settings.tabIndentSpaces === spaces}
                  onClick={() => onUpdateSettings({ tabIndentSpaces: spaces })}
                >
                  {spaces} 空格
                </S.SegmentBtn>
              ))}
            </S.Segment>
            <S.Toggle
              type="button"
              role="switch"
              aria-checked={settings.previewTocDefaultOpen}
              aria-label="预览目录默认展开"
              $checked={settings.previewTocDefaultOpen}
              onClick={() =>
                onUpdateSettings({
                  previewTocDefaultOpen: !settings.previewTocDefaultOpen,
                })
              }
            >
              <span />
            </S.Toggle>
          </S.RowControl>
        </S.Row>
      </S.Card>

      <S.Card>
        <S.CardHeader>个人资料与默认值</S.CardHeader>
        <S.Row>
          <S.RowLabel>
            <strong>说说预览昵称</strong>
          </S.RowLabel>
          <S.Input
            aria-label="预览昵称"
            value={settings.momentAuthorName}
            onChange={(e) =>
              onUpdateSettings({ momentAuthorName: e.target.value })
            }
          />
        </S.Row>
        <S.Row>
          <S.RowLabel>
            <strong>说说预览头像 URL</strong>
          </S.RowLabel>
          <S.RowControl>
            <S.AvatarThumb
              src={settings.momentAuthorAvatar || DEFAULT_MOMENT_AVATAR}
              alt=""
            />
            <S.Input
              aria-label="预览头像 URL"
              value={settings.momentAuthorAvatar}
              onChange={(e) =>
                onUpdateSettings({ momentAuthorAvatar: e.target.value })
              }
            />
            <S.SmallBtn
              type="button"
              onClick={() =>
                onUpdateSettings({ momentAuthorAvatar: DEFAULT_MOMENT_AVATAR })
              }
            >
              默认
            </S.SmallBtn>
          </S.RowControl>
        </S.Row>
        <S.Row>
          <S.RowLabel>
            <strong>新说说默认标签 / 地点</strong>
          </S.RowLabel>
          <S.RowControl>
            <S.Input
              aria-label="默认标签"
              value={tagsInput}
              placeholder="日常, 随想"
              onChange={(e) => {
                setTagsInput(e.target.value);
                onUpdateSettings({
                  defaultMomentTags: parseTagList(e.target.value),
                });
              }}
            />
            <S.Input
              aria-label="默认地点"
              value={settings.defaultMomentLocation}
              placeholder="可选地点"
              onChange={(e) =>
                onUpdateSettings({ defaultMomentLocation: e.target.value })
              }
            />
          </S.RowControl>
        </S.Row>
        <S.Row>
          <S.RowLabel>
            <strong>博客默认作者</strong>
          </S.RowLabel>
          <S.Input
            aria-label="博客默认作者"
            value={settings.defaultPostAuthor}
            placeholder="可选"
            onChange={(e) =>
              onUpdateSettings({ defaultPostAuthor: e.target.value })
            }
          />
        </S.Row>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <span>保护与快捷键</span>
          <S.Toggle
            type="button"
            role="switch"
            aria-checked={settings.enableShortcuts}
            aria-label="启用全局快捷键"
            $checked={settings.enableShortcuts}
            onClick={() =>
              onUpdateSettings({ enableShortcuts: !settings.enableShortcuts })
            }
          >
            <span />
          </S.Toggle>
        </S.CardHeader>
        <S.Row>
          <S.RowLabel>
            <strong>发布前二次确认</strong>
            <span>减少移动端误触提交</span>
          </S.RowLabel>
          <S.Toggle
            type="button"
            role="switch"
            aria-checked={settings.confirmBeforePublish}
            aria-label="发布前二次确认"
            $checked={settings.confirmBeforePublish}
            onClick={() =>
              onUpdateSettings({
                confirmBeforePublish: !settings.confirmBeforePublish,
              })
            }
          >
            <span />
          </S.Toggle>
        </S.Row>
        {SHORTCUTS.map(([desc, keys]) => (
          <S.ShortcutRow key={desc}>
            <span>{desc}</span>
            <kbd>{keys}</kbd>
          </S.ShortcutRow>
        ))}
      </S.Card>
    </>
  );
}
