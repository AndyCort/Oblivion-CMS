import * as S from './ConfigInfoModal.styles';
import React, { useState } from "react";

interface ConfigInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner?: string;
  repo?: string;
  branch?: string;
  path?: string;
  sha?: string;
  isMock?: boolean;
  userEmail?: string;
  bindingName?: string;
  envKeys?: string[];
}

export const ConfigInfoModal: React.FC<ConfigInfoModalProps> = ({
  isOpen,
  onClose,
  sha,
  isMock,
  userEmail,
  bindingName,
  envKeys,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const publicApiUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/public/moments`
      : "/api/public/moments";

  const handleCopyApi = () => {
    navigator.clipboard.writeText(publicApiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <S.Div>
      <S.Div2>
        {/* Header */}
        <S.Div3>
          <S.Div4>
            <S.Div5>
              <S.Settings />
            </S.Div5>
            <div>
              <S.H3>
                数据库与前台集成
              </S.H3>
              <S.P>
                Cloudflare D1 驱动与博客开放数据接口
              </S.P>
            </div>
          </S.Div4>
          <S.Button
            type="button"
            onClick={onClose}

          >
            <S.X />
          </S.Button>
        </S.Div3>

        <S.Div6>
          {/* Public API for Frontend Blog (Highlight Card) */}
          <S.Div7>
            <S.Div8>
              <S.Span>
                <S.Sparkles />
                前台博客实时读取接口 (Public Moments API)
              </S.Span>
              <S.Span2>
                CORS 跨域开放
              </S.Span2>
            </S.Div8>
            <S.P2>
              你的前台博客（如 oblivion-dashboard）无需再等待 GitHub 编译重构，直接调用此接口即可获取最新发布的说说：
            </S.P2>

            {/* API URL Copy row */}
            <S.Div9>
              <S.Input
                type="text"
                readOnly
                value={publicApiUrl}

 />
              <S.Button2
                type="button"
                onClick={handleCopyApi}

              >
                {copied ? (
                  <>
                    <S.Check />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <S.Copy />
                    <span>复制</span>
                  </>
                )}
              </S.Button2>
            </S.Div9>

            {/* Quick JS code snippet */}
            <S.Div10>
              <S.Div11>
                <S.Code2 /> 前台代码调用示例：
              </S.Div11>
              <S.P3>
                const moments = await fetch(&quot;{publicApiUrl}&quot;).then(r =&gt; r.json());
              </S.P3>
            </S.Div10>
          </S.Div7>

          {/* Cloudflare D1 Database Status */}
          <S.Div12>
            <S.Div8>
              <S.Span3>
                <S.Database />
                数据储存引擎 (Cloudflare D1)
              </S.Span3>
              <S.Span4
                $variant={((isMock)) ? "v0" : "v1"}
              >
                {isMock ? "未绑定 (离线模拟)" : "D1 生产数据库 (已联机)"}
              </S.Span4>
            </S.Div8>

            <S.Div13>
              <div>数据表: articles (SQLite)</div>
              <div>当前修订: {sha || "初始版本"}</div>
              <div>
                绑定名称: <S.Span5>env.{bindingName || "DB"}</S.Span5>
              </div>
            </S.Div13>

            {isMock && (
              <S.Div14>
                <S.Div15>
                  ⚠️ 为什么提示未绑定 D1 数据库？
                </S.Div15>
                <S.P4>
                  如果您已经在 Cloudflare 控制台添加了绑定，仍然提示未绑定，<strong>90% 的原因是由于 Cloudflare 尚未重新部署</strong>（添加绑定不会自动应用到已上线的容器）。
                </S.P4>

                {envKeys && envKeys.length > 0 && (
                  <S.Div16>
                    <div>当前容器读取到的配置键：</div>
                    <S.Div17>
                      [{envKeys.join(", ")}]
                    </S.Div17>
                  </S.Div16>
                )}

                <S.Div18>
                  <S.Div19>
                    排查与解决步骤：
                  </S.Div19>
                  <S.Ol>
                    <li>
                      <strong>关键：重新部署（Retry deployment）</strong>：进入 Cloudflare Pages 的 <strong>Deployments</strong> 标签页，点击最新部署右侧的 <strong>...</strong> -&gt; 选择 <strong>Retry deployment</strong>。
                    </li>
                    <li>
                      <strong>检查环境是否匹配</strong>：进入 <strong>Settings</strong> -&gt; <strong>Functions</strong> -&gt; <strong>D1 database bindings</strong>，确保该绑定添加到了 <strong>Production</strong>（生产环境）。
                    </li>
                    <li>
                      <strong>变量名称</strong>：推荐填写 <S.Code>DB</S.Code>（系统也已支持自动识别其它名称）。
                    </li>
                  </S.Ol>
                </S.Div18>
              </S.Div14>
            )}
          </S.Div12>

          {/* Cloudflare Access */}
          <S.Div20>
            <S.Div21>
              <S.Shield />
              后台安全策略 (Zero Trust Access)
            </S.Div21>
            <S.Div22>
              当前操作会话: <S.Span6>{userEmail || "已验证"}</S.Span6>
              <S.P5>
                写权限受 Cloudflare Access 强鉴权保护；前台读取接口已开放公开只读。
              </S.P5>
            </S.Div22>
          </S.Div20>
        </S.Div6>

        {/* Footer action */}
        <S.Div23>
          <S.Button3
            type="button"
            onClick={onClose}

          >
            完成并关闭
          </S.Button3>
        </S.Div23>
      </S.Div2>
    </S.Div>
  );
};
