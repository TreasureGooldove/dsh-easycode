import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {
  AppMode,
  AppStack,
  DevEnvironment,
  EasyCodeError,
  EasyCodeRequest,
  EasyCodeResult,
  WorkflowMode,
} from '../types.ts'

const PLUGIN_ID = 'dsh-easycode'
const NS = 'easycode'

const copy = {
  zh: { nav: 'EasyCode', launch: 'EasyCode', dialogLabel: '创建应用', dialogHint: '从首页直接开始', close: '关闭' },
  en: { nav: 'EasyCode', launch: 'EasyCode', dialogLabel: 'Create app', dialogHint: 'Start directly from Home', close: 'Close' },
}

const OPEN_EASYCODE_EVENT = 'easycode:open'
const CLOSE_EASYCODE_EVENT = 'easycode:close'

interface Choice<T extends string> { id: T; name: string }
interface ChoiceGroup<T extends string> { label: string; items: Array<Choice<T>> }

const STACK_GROUPS: Array<ChoiceGroup<AppStack>> = [
  { label: '智能决策', items: [{ id: 'auto', name: 'DeepSeek 自动决策（推荐）' }] },
  { label: '前端与内容站点', items: [
    { id: 'vanilla', name: 'Vanilla JavaScript + Vite' }, { id: 'react-vite', name: 'React + Vite' },
    { id: 'vue-vite', name: 'Vue + Vite' }, { id: 'svelte-vite', name: 'Svelte + Vite' },
    { id: 'solid-vite', name: 'SolidJS + Vite' }, { id: 'angular', name: 'Angular' },
    { id: 'astro', name: 'Astro' }, { id: 'qwik', name: 'Qwik' },
  ] },
  { label: '全栈 Web', items: [
    { id: 'nextjs', name: 'Next.js' }, { id: 'nuxt', name: 'Nuxt' }, { id: 'remix', name: 'Remix' },
    { id: 'sveltekit', name: 'SvelteKit' }, { id: 'tanstack-start', name: 'TanStack Start' },
  ] },
  { label: '后端与 API', items: [
    { id: 'node-api', name: 'Node.js API' }, { id: 'express', name: 'Express' },
    { id: 'fastify', name: 'Fastify' }, { id: 'nestjs', name: 'NestJS' }, { id: 'hono', name: 'Hono' },
    { id: 'bun-api', name: 'Bun API' }, { id: 'deno-api', name: 'Deno API' },
    { id: 'python-fastapi', name: 'Python + FastAPI' }, { id: 'python-django', name: 'Python + Django' },
    { id: 'go-api', name: 'Go API' }, { id: 'rust-axum', name: 'Rust + Axum' },
    { id: 'java-spring', name: 'Java + Spring Boot' }, { id: 'kotlin-ktor', name: 'Kotlin + Ktor' },
    { id: 'dotnet-api', name: '.NET Web API' }, { id: 'php-laravel', name: 'PHP + Laravel' },
    { id: 'ruby-rails', name: 'Ruby on Rails' },
  ] },
  { label: '桌面、移动端与扩展', items: [
    { id: 'electron', name: 'Electron' }, { id: 'tauri', name: 'Tauri' },
    { id: 'react-native', name: 'React Native' }, { id: 'expo', name: 'Expo' },
    { id: 'flutter', name: 'Flutter' }, { id: 'browser-extension', name: '浏览器扩展' },
  ] },
  { label: '其他', items: [{ id: 'custom', name: '自定义技术栈…' }] },
]

const ENVIRONMENT_GROUPS: Array<ChoiceGroup<DevEnvironment>> = [
  { label: '智能决策', items: [{ id: 'auto', name: 'DeepSeek 自动决策（推荐）' }] },
  { label: '本机与容器', items: [
    { id: 'local', name: '本地开发' }, { id: 'docker', name: 'Docker' },
    { id: 'podman', name: 'Podman' }, { id: 'devcontainer', name: 'Dev Container' },
    { id: 'wsl', name: 'WSL' }, { id: 'nix', name: 'Nix / devenv' },
  ] },
  { label: '远程与云端', items: [
    { id: 'remote-ssh', name: '远程 SSH' }, { id: 'codespaces', name: 'GitHub Codespaces' },
    { id: 'kubernetes', name: 'Kubernetes 开发环境' },
  ] },
  { label: '其他', items: [{ id: 'custom', name: '自定义开发环境…' }] },
]

const STACKS = STACK_GROUPS.flatMap(group => group.items)
const ENVIRONMENTS = ENVIRONMENT_GROUPS.flatMap(group => group.items)

const STYLES = `
.ec-root {
  --ec-canvas: #f6f8f7;
  --ec-panel: #ffffff;
  --ec-panel-raised: #ffffff;
  --ec-panel-soft: #eef7f3;
  --ec-text: #17211e;
  --ec-muted: #5f6e69;
  --ec-faint: #7f8b87;
  --ec-border: #d8e0dd;
  --ec-border-strong: #bac8c3;
  --ec-accent: #177a62;
  --ec-accent-strong: #0e624d;
  --ec-accent-soft: #e2f4ed;
  --ec-accent-contrast: #ffffff;
  --ec-switch-off: #aebbb7;
  --ec-warn: #84551a;
  --ec-warn-soft: #fff6e5;
  --ec-error: #a62b2b;
  --ec-error-soft: #fff1f0;
  --ec-success: #176b50;
  --ec-shadow-sm: 0 1px 2px rgba(16, 43, 35, .05);
  --ec-shadow-md: 0 18px 48px rgba(16, 43, 35, .10);
  --ec-focus: rgba(23, 122, 98, .32);
  color: var(--ec-text);
  min-height: 100%;
  padding: 8px 2px 44px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  container-type: inline-size;
}
.ec-root, .ec-root * { box-sizing: border-box; }

body[data-ds-dark-theme] .ec-root {
  --ec-canvas: #202321;
  --ec-panel: #242725;
  --ec-panel-raised: #282b29;
  --ec-panel-soft: #243029;
  --ec-text: #f5f7f6;
  --ec-muted: #b8c1bd;
  --ec-faint: #929d98;
  --ec-border: #3b423f;
  --ec-border-strong: #4b5651;
  --ec-accent: #22c55e;
  --ec-accent-strong: #4ade80;
  --ec-accent-soft: #20352a;
  --ec-accent-contrast: #052e16;
  --ec-switch-off: #59625e;
  --ec-warn: #f5c56b;
  --ec-warn-soft: #392f21;
  --ec-error: #ffaaa4;
  --ec-error-soft: #3b2728;
  --ec-success: #79dda5;
  --ec-shadow-sm: 0 1px 2px rgba(0, 0, 0, .24);
  --ec-shadow-md: 0 18px 48px rgba(0, 0, 0, .24);
  --ec-focus: rgba(74, 222, 128, .34);
}

.ec-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 28px;
  align-items: end;
  padding: 12px 4px 28px;
  overflow: hidden;
}
.ec-hero::after {
  content: '';
  position: absolute;
  right: 8%;
  bottom: -70px;
  width: 240px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--ec-accent) 15%, transparent), transparent 68%);
  pointer-events: none;
}
.ec-kicker { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; color: var(--ec-accent); font-size: 11px; font-weight: 760; letter-spacing: .16em; text-transform: uppercase; }
.ec-kicker::before { content: ''; width: 22px; height: 1px; background: currentColor; }
.ec-title { max-width: 720px; margin: 0; font-size: clamp(34px, 5vw, 54px); line-height: 1.02; letter-spacing: -.052em; text-wrap: balance; }
.ec-intro { max-width: 660px; margin: 16px 0 0; color: var(--ec-muted); font-size: 15px; line-height: 1.7; }
.ec-version { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 7px; min-height: 30px; border: 1px solid var(--ec-border-strong); border-radius: 999px; background: var(--ec-panel); padding: 5px 11px; color: var(--ec-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11px; box-shadow: var(--ec-shadow-sm); }
.ec-version::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--ec-accent); box-shadow: 0 0 0 3px var(--ec-accent-soft); }

.ec-mode-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 24px 0 26px; }
.ec-mode { position: relative; min-height: 176px; border: 1px solid var(--ec-border); border-radius: 16px; background: var(--ec-panel); color: inherit; padding: 18px; text-align: left; cursor: pointer; box-shadow: var(--ec-shadow-sm); transition: border-color 160ms ease, box-shadow 180ms ease, transform 120ms ease, background 180ms ease; touch-action: manipulation; }
.ec-mode:hover { border-color: var(--ec-border-strong); box-shadow: 0 10px 28px rgba(16, 43, 35, .09); }
.ec-mode:active { transform: scale(.99); }
.ec-mode[data-active='true'] { border-color: var(--ec-accent); background: linear-gradient(135deg, var(--ec-accent-soft), var(--ec-panel) 72%); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ec-accent) 22%, transparent), var(--ec-shadow-sm); }
.ec-mode-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.ec-mode-icon { display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid var(--ec-border); border-radius: 11px; background: var(--ec-canvas); color: var(--ec-muted); }
.ec-mode[data-active='true'] .ec-mode-icon { border-color: color-mix(in srgb, var(--ec-accent) 45%, var(--ec-border)); background: var(--ec-accent); color: var(--ec-accent-contrast); }
.ec-mode-badge { display: inline-flex; align-items: center; min-height: 24px; border: 1px solid var(--ec-border); border-radius: 999px; padding: 3px 8px; color: var(--ec-muted); font-size: 10px; font-weight: 680; }
.ec-mode strong { display: block; margin-top: 14px; font-size: 17px; letter-spacing: -.015em; }
.ec-mode-copy { display: block; margin-top: 7px; color: var(--ec-muted); font-size: 13px; line-height: 1.55; }
.ec-mode-features { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 13px; }
.ec-mode-features span { display: inline-flex; align-items: center; gap: 5px; color: var(--ec-faint); font-size: 10px; }
.ec-mode-features span::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: var(--ec-accent); }

.ec-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(250px, 300px); gap: 20px; align-items: start; }
.ec-form { display: grid; gap: 14px; min-width: 0; }
.ec-section { border: 1px solid var(--ec-border); border-radius: 16px; background: var(--ec-panel); padding: 20px; box-shadow: var(--ec-shadow-sm); }
.ec-section-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.ec-section-title { display: flex; align-items: center; gap: 10px; min-width: 0; }
.ec-section-icon { display: grid; place-items: center; flex: 0 0 auto; width: 32px; height: 32px; border-radius: 9px; background: var(--ec-accent-soft); color: var(--ec-accent); }
.ec-section-head h3 { margin: 0; font-size: 15px; line-height: 1.35; letter-spacing: -.01em; }
.ec-section-head p { margin: 3px 0 0; color: var(--ec-muted); font-size: 11px; line-height: 1.45; }
.ec-section-meta { flex: none; border: 1px solid var(--ec-border); border-radius: 999px; padding: 3px 8px; color: var(--ec-faint); font-size: 10px; }
.ec-field { display: grid; gap: 7px; min-width: 0; }
.ec-field + .ec-field { margin-top: 16px; }
.ec-label { display: flex; align-items: center; gap: 5px; color: var(--ec-text); font-size: 13px; font-weight: 680; }
.ec-required { color: var(--ec-error); }
.ec-help { min-height: 18px; margin: 0; color: var(--ec-muted); font-size: 11px; line-height: 1.55; }
.ec-field-error { min-height: 18px; margin: 0; color: var(--ec-error); font-size: 11px; font-weight: 620; line-height: 1.5; }
.ec-input, .ec-textarea, .ec-select {
  width: 100%;
  min-height: 46px;
  border: 1px solid var(--ec-border-strong);
  border-radius: 10px;
  background: var(--ec-panel-raised);
  color: var(--ec-text);
  font: inherit;
  font-size: 14px;
  padding: 11px 12px;
  box-shadow: inset 0 1px 1px rgba(16, 43, 35, .03);
  transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
}
.ec-input::placeholder, .ec-textarea::placeholder { color: var(--ec-faint); opacity: .82; }
.ec-input:hover, .ec-textarea:hover, .ec-select:hover { border-color: color-mix(in srgb, var(--ec-accent) 45%, var(--ec-border-strong)); }
.ec-input[aria-invalid='true'], .ec-textarea[aria-invalid='true'], .ec-select[aria-invalid='true'] { border-color: var(--ec-error); background: var(--ec-error-soft); }
.ec-textarea { min-height: 116px; resize: vertical; line-height: 1.6; }
.ec-code { min-height: 160px; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12px; }
.ec-input:focus, .ec-textarea:focus, .ec-select:focus, .ec-button:focus-visible, .ec-mode:focus-visible, .ec-copy:focus-visible, .ec-switch:focus-visible { outline: 3px solid var(--ec-focus); outline-offset: 2px; border-color: var(--ec-accent); }

.ec-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ec-decision-note { display: flex; gap: 10px; align-items: flex-start; margin: 14px 0 0; border: 1px solid color-mix(in srgb, var(--ec-accent) 28%, var(--ec-border)); border-radius: 11px; background: var(--ec-accent-soft); padding: 11px 12px; color: var(--ec-muted); font-size: 11px; line-height: 1.55; }
.ec-decision-note svg { flex: 0 0 auto; margin-top: 1px; color: var(--ec-accent); }
.ec-auto-plan { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
.ec-auto-plan div { border: 1px solid var(--ec-border); border-radius: 11px; background: var(--ec-canvas); padding: 11px; }
.ec-auto-plan strong { display: block; font-size: 11px; }
.ec-auto-plan span { display: block; margin-top: 4px; color: var(--ec-muted); font-size: 10px; line-height: 1.45; }

.ec-switch-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 16px; align-items: center; min-height: 64px; padding: 10px 0; border-bottom: 1px solid var(--ec-border); }
.ec-switch-row:last-child { border-bottom: 0; }
.ec-switch-copy strong { display: block; font-size: 13px; }
.ec-switch-copy > span { display: block; margin-top: 4px; color: var(--ec-muted); font-size: 11px; line-height: 1.5; }
.ec-switch { position: relative; width: 46px; height: 44px; border: 0; border-radius: 999px; background: transparent; cursor: pointer; transition: opacity 150ms ease; touch-action: manipulation; }
.ec-switch::before { content: ''; position: absolute; inset: 8px 0; border-radius: 999px; background: var(--ec-switch-off); transition: background 150ms ease, box-shadow 150ms ease; }
.ec-switch::after { content: ''; position: absolute; top: 12px; left: 4px; width: 20px; height: 20px; border-radius: 50%; background: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, .22); transition: transform 160ms cubic-bezier(.2, .8, .2, 1); }
.ec-switch[aria-checked='true']::before { background: var(--ec-accent); }
.ec-switch[aria-checked='true']::after { transform: translateX(18px); }
.ec-switch:disabled { cursor: not-allowed; opacity: .45; }
.ec-wip { display: inline-flex !important; vertical-align: middle; margin-left: 6px !important; border: 1px solid color-mix(in srgb, var(--ec-warn) 58%, transparent); border-radius: 999px; background: var(--ec-warn-soft); padding: 2px 7px; color: var(--ec-warn) !important; font-size: 9px !important; font-weight: 760; letter-spacing: .08em; line-height: 1.2 !important; }

.ec-error-summary { border: 1px solid color-mix(in srgb, var(--ec-error) 50%, var(--ec-border)); border-radius: 12px; background: var(--ec-error-soft); padding: 12px 14px; color: var(--ec-error); }
.ec-error-summary:focus { outline: 3px solid var(--ec-focus); outline-offset: 2px; }
.ec-error-summary strong { display: block; font-size: 12px; }
.ec-error-summary p { margin: 4px 0 0; font-size: 11px; line-height: 1.5; }

.ec-summary { position: sticky; top: 12px; border: 1px solid var(--ec-border); border-radius: 16px; background: var(--ec-panel-raised); padding: 18px; box-shadow: var(--ec-shadow-md); overflow: hidden; }
.ec-summary::before { content: ''; display: block; width: 44px; height: 3px; margin-bottom: 16px; border-radius: 999px; background: var(--ec-accent); }
.ec-summary-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 16px; }
.ec-summary h3 { margin: 0; font-size: 15px; }
.ec-summary-subtitle { margin: 4px 0 0; color: var(--ec-muted); font-size: 10px; }
.ec-summary-mode { border: 1px solid var(--ec-border); border-radius: 999px; background: var(--ec-canvas); padding: 3px 8px; color: var(--ec-muted); font-size: 10px; font-weight: 680; }
.ec-summary dl { display: grid; gap: 0; margin: 0; }
.ec-summary dl > div { display: grid; grid-template-columns: 70px minmax(0, 1fr); gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--ec-border); }
.ec-summary dl > div:last-child { border-bottom: 0; }
.ec-summary dt { color: var(--ec-muted); font-size: 11px; }
.ec-summary dd { min-width: 0; margin: 0; font-size: 11px; font-weight: 660; text-align: right; overflow-wrap: anywhere; }
.ec-action { margin-top: 16px; }
.ec-button { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; min-height: 48px; border: 1px solid transparent; border-radius: 11px; background: var(--ec-accent); color: var(--ec-accent-contrast); padding: 12px 15px; font: inherit; font-size: 13px; font-weight: 760; cursor: pointer; box-shadow: 0 10px 24px color-mix(in srgb, var(--ec-accent) 22%, transparent); transition: background 150ms ease, box-shadow 150ms ease, transform 120ms ease; touch-action: manipulation; }
.ec-button:hover { background: var(--ec-accent-strong); box-shadow: 0 12px 28px color-mix(in srgb, var(--ec-accent) 28%, transparent); }
.ec-button:active { transform: scale(.985); }
.ec-button:disabled { cursor: wait; opacity: .58; box-shadow: none; }
.ec-spinner { width: 15px; height: 15px; border: 2px solid color-mix(in srgb, var(--ec-accent-contrast) 38%, transparent); border-top-color: var(--ec-accent-contrast); border-radius: 50%; animation: ec-spin .8s linear infinite; }
@keyframes ec-spin { to { transform: rotate(360deg); } }
.ec-error { margin: 12px 0 0; color: var(--ec-error); font-size: 11px; line-height: 1.5; }
.ec-result { margin-top: 14px; border: 1px solid color-mix(in srgb, var(--ec-success) 42%, var(--ec-border)); border-radius: 11px; background: var(--ec-accent-soft); padding: 13px; }
.ec-result strong { display: flex; align-items: center; gap: 7px; color: var(--ec-success); font-size: 12px; }
.ec-path { margin: 7px 0 0; color: var(--ec-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10px; line-height: 1.5; overflow-wrap: anywhere; }
.ec-copy { display: inline-flex; align-items: center; gap: 6px; min-height: 36px; margin-top: 10px; border: 1px solid var(--ec-border-strong); border-radius: 8px; background: var(--ec-panel); color: inherit; padding: 7px 9px; font: inherit; font-size: 10px; cursor: pointer; }
.ec-copy:hover { border-color: var(--ec-accent); background: var(--ec-accent-soft); }
.ec-footnote { margin: 13px 0 0; color: var(--ec-muted); font-size: 10px; line-height: 1.55; }

.ec-launcher {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--dsw-alias-label-primary, #202725);
  padding: 8px;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background 150ms ease, transform 120ms ease;
  touch-action: manipulation;
}
.ec-launcher:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, .06)); }
.ec-launcher:active { transform: scale(.985); }
.ec-launcher:focus-visible { outline: 3px solid var(--ec-focus, rgba(23, 122, 98, .32)); outline-offset: 2px; }
.ec-launcher[data-wide='false'] { justify-content: center; width: 44px; padding-inline: 0; }
.ec-launcher-mark { display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; width: 24px; height: 24px; border: 1px solid rgba(23, 122, 98, .45); border-radius: 7px; background: rgba(23, 122, 98, .12); color: #177a62; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 9px; font-weight: 780; letter-spacing: -.03em; }
body[data-ds-dark-theme] .ec-launcher-mark { color: #4ade80; border-color: rgba(74, 222, 128, .48); background: rgba(74, 222, 128, .12); }
.ec-launcher-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ec-overlay { position: absolute; z-index: 100; inset: 0; display: grid; place-items: center; padding: 18px; background: var(--dsw-alias-bg-mask-1, rgba(7, 12, 20, .68)); backdrop-filter: blur(8px); }
.ec-overlay-panel { display: flex; flex-direction: column; width: min(1160px, 100%); max-height: 100%; border: 1px solid var(--dsw-alias-border-l2, #d9dcd8); border-radius: 20px; background: var(--dsw-alias-bg-layer-1, #ffffff); color: var(--dsw-alias-label-primary, #202725); box-shadow: 0 28px 90px rgba(0, 0, 0, .38); overflow: hidden; animation: ec-modal-in 180ms cubic-bezier(.2, .8, .2, 1); }
@keyframes ec-modal-in { from { opacity: 0; transform: translateY(8px) scale(.992); } to { opacity: 1; transform: none; } }
.ec-overlay-head { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 64px; padding: 10px 18px; border-bottom: 1px solid var(--dsw-alias-border-l2, #d9dcd8); }
.ec-overlay-brand { display: flex; align-items: center; gap: 11px; min-width: 0; }
.ec-overlay-logo { display: grid; place-items: center; flex: 0 0 auto; width: 32px; height: 32px; border: 1px solid rgba(23, 122, 98, .4); border-radius: 9px; background: rgba(23, 122, 98, .12); color: #177a62; }
body[data-ds-dark-theme] .ec-overlay-logo { color: #4ade80; border-color: rgba(74, 222, 128, .42); background: rgba(74, 222, 128, .12); }
.ec-overlay-brand-copy { min-width: 0; }
.ec-overlay-brand strong { display: block; font-size: 14px; line-height: 1.3; }
.ec-overlay-brand-copy > span { display: block; margin-top: 2px; color: var(--dsw-alias-label-tertiary, #69716e); font-size: 10px; }
.ec-overlay-close { display: grid; place-items: center; flex: none; width: 44px; height: 44px; border: 1px solid var(--dsw-alias-border-l2, #d9dcd8); border-radius: 11px; background: transparent; color: var(--dsw-alias-label-primary, #202725); padding: 0; cursor: pointer; transition: background 150ms ease, transform 120ms ease; }
.ec-overlay-close:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, .06)); }
.ec-overlay-close:active { transform: scale(.95); }
.ec-overlay-close:focus-visible { outline: 3px solid rgba(23, 122, 98, .32); outline-offset: 2px; }
.ec-overlay-body { min-height: 0; overflow: auto; overscroll-behavior: contain; padding: 24px 28px 0; background: var(--ec-canvas, transparent); scroll-padding-block: 88px 24px; }
.ec-overlay-body > .ec-root { width: min(1000px, 100%); margin-inline: auto; }

@container (max-width: 820px) {
  .ec-layout { grid-template-columns: 1fr; }
  .ec-summary { position: static; }
}
@container (max-width: 620px) {
  .ec-mode-grid, .ec-grid-2, .ec-auto-plan { grid-template-columns: 1fr; }
  .ec-mode { min-height: 164px; }
}
@media (max-width: 560px) {
  .ec-overlay { padding: 0; backdrop-filter: none; }
  .ec-overlay-panel { width: 100%; height: 100%; max-height: 100%; border: 0; border-radius: 0; animation: none; }
  .ec-overlay-head { padding-inline: 14px; }
  .ec-overlay-body { padding: 18px 14px 0; }
  .ec-overlay-brand-copy > span { display: none; }
  .ec-root { padding-bottom: max(32px, env(safe-area-inset-bottom)); }
  .ec-hero { grid-template-columns: 1fr; gap: 16px; padding-top: 4px; }
  .ec-version { justify-self: start; }
  .ec-title { font-size: clamp(32px, 11vw, 44px); }
  .ec-intro { font-size: 15px; }
  .ec-mode-copy { font-size: 14px; }
  .ec-section { padding: 16px; }
  .ec-section-head { align-items: flex-start; }
  .ec-section-meta { display: none; }
  .ec-input, .ec-textarea, .ec-select { font-size: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .ec-root *, .ec-root *::before, .ec-root *::after, .ec-overlay-panel { animation: none !important; scroll-behavior: auto !important; transition: none !important; }
}
`

function ensureStyles(): () => void {
  const existing = document.querySelector<HTMLStyleElement>(`style[data-plugin="${PLUGIN_ID}"]`)
  if (existing !== null) return () => undefined
  const style = document.createElement('style')
  style.dataset.plugin = PLUGIN_ID
  style.textContent = STYLES
  document.head.append(style)
  return () => style.remove()
}

interface LocaleSeat {
  t: (key: string) => string
}

type EasyCodeHandoff = (outputPath: string, prompt: string) => Promise<void>

type IconName = 'sparkles' | 'sliders' | 'folder' | 'layers' | 'terminal' | 'palette' | 'plug' | 'arrow' | 'check' | 'info' | 'copy' | 'close'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, JSX.Element> = {
    sparkles: <><path d="m12 3 1.35 3.65L17 8l-3.65 1.35L12 13l-1.35-3.65L7 8l3.65-1.35L12 3Z" /><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" /><path d="m19 12 .65 1.35L21 14l-1.35.65L19 16l-.65-1.35L17 14l1.35-.65L19 12Z" /></>,
    sliders: <><path d="M4 7h10" /><path d="M18 7h2" /><path d="M4 17h2" /><path d="M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
    folder: <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />,
    layers: <><path d="m12 3-9 5 9 5 9-5-9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 16 9 5 9-5" /></>,
    terminal: <><path d="m5 7 4 4-4 4" /><path d="M11 17h8" /><rect x="3" y="4" width="18" height="16" rx="2" /></>,
    palette: <><circle cx="12" cy="12" r="9" /><circle cx="8" cy="9" r="1" /><circle cx="12" cy="7" r="1" /><circle cx="16" cy="9" r="1" /><path d="M15 16c0 1.1-.9 2-2 2h-1a2 2 0 0 1 0-4h1a2 2 0 0 1 2 2Z" /></>,
    plug: <><path d="M8 3v5" /><path d="M16 3v5" /><path d="M6 8h12v2a6 6 0 0 1-12 0V8Z" /><path d="M12 16v5" /></>,
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></>,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function EasyCodeLauncher({ wide, t }: LocaleSeat & { wide: boolean }) {
  function open(event: ReactMouseEvent<HTMLButtonElement>) {
    window.dispatchEvent(new CustomEvent(OPEN_EASYCODE_EVENT, {
      detail: { returnFocus: event.currentTarget },
    }))
  }

  return <button
    className="ec-launcher"
    type="button"
    data-wide={String(wide)}
    aria-label={t('launch')}
    title={wide ? undefined : t('launch')}
    onClick={open}
  >
    <span className="ec-launcher-mark" aria-hidden="true">EC</span>
    {wide && <span className="ec-launcher-label">{t('launch')}</span>}
  </button>
}

function EasyCodeOverlay({ t, handoff }: LocaleSeat & { handoff: EasyCodeHandoff }) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  function close() {
    setOpen(false)
    queueMicrotask(() => returnFocusRef.current?.focus())
  }

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ returnFocus?: HTMLElement }>).detail
      returnFocusRef.current = detail?.returnFocus ?? document.activeElement as HTMLElement | null
      setOpen(true)
    }
    window.addEventListener(OPEN_EASYCODE_EVENT, handleOpen)
    window.addEventListener(CLOSE_EASYCODE_EVENT, close)
    return () => {
      window.removeEventListener(OPEN_EASYCODE_EVENT, handleOpen)
      window.removeEventListener(CLOSE_EASYCODE_EVENT, close)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key === 'Tab') {
        const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])') ?? [])
        const first = focusable[0]
        const last = focusable.at(-1)
        if (first === undefined || last === undefined) return
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [open])

  if (!open) return null
  return <div className="ec-overlay" onMouseDown={event => { if (event.target === event.currentTarget) close() }}>
    <section ref={panelRef} className="ec-overlay-panel" role="dialog" aria-modal="true" aria-labelledby="ec-overlay-title" aria-describedby="ec-overlay-hint">
      <header className="ec-overlay-head">
        <div className="ec-overlay-brand"><span className="ec-overlay-logo" aria-hidden="true"><Icon name="sparkles" size={17} /></span><div className="ec-overlay-brand-copy"><strong id="ec-overlay-title">{t('dialogLabel')}</strong><span id="ec-overlay-hint">{t('dialogHint')}</span></div></div>
        <button ref={closeRef} className="ec-overlay-close" type="button" aria-label={t('close')} title={t('close')} onClick={close}><Icon name="close" size={19} /></button>
      </header>
      <div className="ec-overlay-body"><EasyCodeWizard handoff={handoff} /></div>
    </section>
  </div>
}

function Toggle({ checked, onChange, label, disabled = false }: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  disabled?: boolean
}) {
  return <button
    className="ec-switch"
    type="button"
    role="switch"
    aria-label={label}
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
  />
}

function slugFromTopic(value: string): string {
  const ascii = value.toLowerCase().trim()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32)
  return ascii || 'my-app'
}

function stackName(stack: AppStack): string {
  return STACKS.find(item => item.id === stack)?.name ?? stack
}

function environmentName(environment: DevEnvironment): string {
  return ENVIRONMENTS.find(item => item.id === environment)?.name ?? environment
}

function agentPrompt(config: EasyCodeRequest): string {
  const action = config.workflow === 'plan'
    ? '保持 Plan 模式：只完善需求、架构、任务拆分、风险与验收标准，不实现应用代码。'
    : '进入 Go 模式：实现完整、可运行的应用，执行适合所选技术栈的检查并修复发现的问题。'
  return `这是 EasyCode 创建的项目。请先完整读取 EASYCODE.md、PLAN.md 和 README.md，再继续开发。${action}不要自动搜索或安装 MCP；该能力在 EasyCode v1 中仍为 WIP。`
}

type EasyCodeField = 'projectName' | 'topic' | 'stackDetail' | 'environmentDetail' | 'mcpJson'
type EasyCodeFieldErrors = Partial<Record<EasyCodeField, string>>

function validateMcpJson(value: string): string | undefined {
  try {
    const parsed = JSON.parse(value) as unknown
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return '请输入 JSON 对象，例如 { "server": { "command": "..." } }。'
    }
    return undefined
  } catch {
    return 'JSON 格式不完整，请检查引号、逗号和括号。'
  }
}

function EasyCodeWizard({ handoff }: { handoff: EasyCodeHandoff }) {
  const [mode, setMode] = useState<AppMode>('simple')
  const [projectName, setProjectName] = useState('my-app')
  const [topic, setTopic] = useState('')
  const [stack, setStack] = useState<AppStack>('auto')
  const [stackDetail, setStackDetail] = useState('')
  const [environment, setEnvironment] = useState<DevEnvironment>('auto')
  const [environmentDetail, setEnvironmentDetail] = useState('')
  const [initializeGit, setInitializeGit] = useState(true)
  const [workflow, setWorkflow] = useState<WorkflowMode>('go')
  const [designGoal, setDesignGoal] = useState('清晰、快速、移动端可用')
  const [mcpEnabled, setMcpEnabled] = useState(false)
  const [mcpJson, setMcpJson] = useState('{}')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<EasyCodeResult | null>(null)
  const [handoffState, setHandoffState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const [copied, setCopied] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<EasyCodeField, boolean>>>({})
  const [showValidationSummary, setShowValidationSummary] = useState(false)
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  const effective = useMemo(() => mode === 'simple'
    ? { stack: 'auto' as AppStack, environment: 'auto' as DevEnvironment, workflow: 'go' as WorkflowMode, git: false, mcp: false }
    : { stack, environment, workflow, git: initializeGit, mcp: mcpEnabled },
  [mode, stack, environment, workflow, initializeGit, mcpEnabled])

  const validationErrors = useMemo<EasyCodeFieldErrors>(() => {
    const next: EasyCodeFieldErrors = {}
    if (!projectName.trim()) next.projectName = '请填写项目名称。'
    if (!topic.trim()) next.topic = '请用一句话描述要创建的应用。'
    if (mode === 'professional' && stack === 'custom' && !stackDetail.trim()) next.stackDetail = '请填写自定义技术栈。'
    if (mode === 'professional' && environment === 'custom' && !environmentDetail.trim()) next.environmentDetail = '请填写自定义开发环境。'
    if (mode === 'professional' && mcpEnabled) {
      const mcpError = validateMcpJson(mcpJson)
      if (mcpError !== undefined) next.mcpJson = mcpError
    }
    return next
  }, [projectName, topic, mode, stack, stackDetail, environment, environmentDetail, mcpEnabled, mcpJson])

  function touch(field: EasyCodeField) {
    setTouched(current => ({ ...current, [field]: true }))
  }

  function visibleError(field: EasyCodeField): string | undefined {
    return touched[field] === true ? validationErrors[field] : undefined
  }

  function chooseMode(next: AppMode) {
    setMode(next)
    setError('')
    setResult(null)
    setHandoffState('idle')
    setTouched({})
    setShowValidationSummary(false)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setResult(null)
    setHandoffState('idle')
    setCopied(false)
    const fields: EasyCodeField[] = ['projectName', 'topic']
    if (mode === 'professional' && effective.stack === 'custom') fields.push('stackDetail')
    if (mode === 'professional' && effective.environment === 'custom') fields.push('environmentDetail')
    if (mode === 'professional' && effective.mcp) fields.push('mcpJson')
    setTouched(Object.fromEntries(fields.map(field => [field, true])) as Partial<Record<EasyCodeField, boolean>>)
    if (fields.some(field => validationErrors[field] !== undefined)) {
      setShowValidationSummary(true)
      queueMicrotask(() => errorSummaryRef.current?.focus())
      return
    }
    setShowValidationSummary(false)

    let mcpServers: EasyCodeRequest['mcpServers'] = {}
    if (effective.mcp) {
      mcpServers = JSON.parse(mcpJson) as EasyCodeRequest['mcpServers']
    }

    const payload: EasyCodeRequest = {
      mode,
      projectName: projectName.trim(),
      topic: topic.trim(),
      stack: effective.stack,
      stackDetail: mode === 'professional' && effective.stack === 'custom' ? stackDetail.trim() : '',
      environment: effective.environment,
      environmentDetail: mode === 'professional' && effective.environment === 'custom' ? environmentDetail.trim() : '',
      initializeGit: effective.git,
      workflow: effective.workflow,
      designGoal: mode === 'simple' ? '' : designGoal.trim(),
      mcpEnabled: effective.mcp,
      mcpServers,
    }

    setSubmitting(true)
    try {
      const response = await fetch('/easycode/api/projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-easycode-request': '1' },
        body: JSON.stringify(payload),
      })
      const data = await response.json() as EasyCodeResult | EasyCodeError
      if (!response.ok || !data.ok) throw new Error(data.ok ? '创建项目失败' : data.error)
      setResult(data)
      setHandoffState('sending')
      try {
        await handoff(data.outputPath, agentPrompt(payload))
        setHandoffState('sent')
        window.dispatchEvent(new Event(CLOSE_EASYCODE_EVENT))
      } catch (cause) {
        setHandoffState('failed')
        const detail = cause instanceof Error ? cause.message : '未知错误'
        setError(`项目目录已创建，但无法启动 DeepSeek 开发会话：${detail}`)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '创建项目失败，请稍后重试。')
    } finally {
      setSubmitting(false)
    }
  }

  async function copyPath() {
    if (result === null) return
    try {
      await navigator.clipboard.writeText(result.outputPath)
      setCopied(true)
    } catch {
      setError('无法访问剪贴板，请手动复制项目路径。')
    }
  }

  const submitLabel = submitting
    ? handoffState === 'sending' ? '正在交给 DeepSeek…' : '正在准备项目…'
    : effective.workflow === 'plan' ? '让 DeepSeek 制定计划' : '让 DeepSeek 创建应用'

  return <div className="ec-root">
    <header className="ec-hero">
      <div>
        <p className="ec-kicker">Click to build</p>
        <h2 className="ec-title">把想法变成可运行的应用。</h2>
        <p className="ec-intro">描述目标，选择需要的控制粒度。EasyCode 会准备安全的本地工作区，再由 DeepSeek 决策技术路线、生成代码并继续开发。</p>
      </div>
      <span className="ec-version">v0.1</span>
    </header>

    <div className="ec-mode-grid" role="group" aria-label="创建模式">
      <button className="ec-mode" type="button" aria-label="简易模式" aria-pressed={mode === 'simple'} data-active={mode === 'simple'} onClick={() => chooseMode('simple')}>
        <span className="ec-mode-top"><span className="ec-mode-icon"><Icon name="sparkles" size={20} /></span><span className="ec-mode-badge">最快开始</span></span>
        <strong>简易模式</strong>
        <span className="ec-mode-copy">只描述要做什么，技术路线与执行细节交给 DeepSeek。</span>
        <span className="ec-mode-features"><span>零配置</span><span>自动决策</span><span>直接创建</span></span>
      </button>
      <button className="ec-mode" type="button" aria-label="专业模式" aria-pressed={mode === 'professional'} data-active={mode === 'professional'} onClick={() => chooseMode('professional')}>
        <span className="ec-mode-top"><span className="ec-mode-icon"><Icon name="sliders" size={20} /></span><span className="ec-mode-badge">完整控制</span></span>
        <strong>专业模式</strong>
        <span className="ec-mode-copy">指定技术栈、环境、Git、工作流、设计目标与 MCP。</span>
        <span className="ec-mode-features"><span>工程约束</span><span>Plan / Go</span><span>手动 MCP</span></span>
      </button>
    </div>

    <form className="ec-layout" noValidate onSubmit={submit}>
      <div className="ec-form">
        {showValidationSummary && Object.keys(validationErrors).length > 0 && <div ref={errorSummaryRef} className="ec-error-summary" role="alert" tabIndex={-1}>
          <strong>还差一点信息</strong>
          <p>请检查下方标记的字段，修正后即可继续创建。</p>
        </div>}

        <section className="ec-section" aria-labelledby="ec-section-project">
          <div className="ec-section-head">
            <div className="ec-section-title"><span className="ec-section-icon"><Icon name="folder" /></span><div><h3 id="ec-section-project">项目基础</h3><p>告诉 DeepSeek 要创建什么</p></div></div>
            <span className="ec-section-meta">必填</span>
          </div>
          <div className="ec-grid-2">
            <div className="ec-field">
              <label className="ec-label" htmlFor="ec-project-name">项目名称 <span className="ec-required" aria-hidden="true">*</span></label>
              <input id="ec-project-name" className="ec-input" aria-label="项目名称" aria-invalid={visibleError('projectName') !== undefined} aria-describedby="ec-project-help ec-project-error" value={projectName} maxLength={64} onBlur={() => touch('projectName')} onChange={event => setProjectName(event.target.value)} placeholder="my-app" autoComplete="off" required />
              <p className="ec-help" id="ec-project-help">将作为本地目录名，不会覆盖同名目录。</p>
              <p className="ec-field-error" id="ec-project-error" aria-live="polite">{visibleError('projectName') ?? ''}</p>
            </div>
            <div className="ec-field">
              <label className="ec-label" htmlFor="ec-topic">一句话主题 <span className="ec-required" aria-hidden="true">*</span></label>
              <input id="ec-topic" className="ec-input" aria-label="一句话主题" aria-invalid={visibleError('topic') !== undefined} aria-describedby="ec-topic-help ec-topic-error" value={topic} maxLength={2000} onBlur={() => touch('topic')} onChange={event => {
                const next = event.target.value
                setTopic(next)
                if (projectName === 'my-app' && next.trim()) setProjectName(slugFromTopic(next))
              }} placeholder="例如：给独立开发者使用的待办应用" autoComplete="off" required />
              <p className="ec-help" id="ec-topic-help">写清用户、场景和目标，生成结果会更准确。</p>
              <p className="ec-field-error" id="ec-topic-error" aria-live="polite">{visibleError('topic') ?? ''}</p>
            </div>
          </div>
          {mode === 'simple' && <div className="ec-auto-plan" aria-label="简易模式自动完成的工作">
            <div><strong>技术方案</strong><span>根据产品目标自动选择</span></div>
            <div><strong>开发环境</strong><span>采用最合适的本地方案</span></div>
            <div><strong>执行方式</strong><span>进入 Go 模式生成并验证</span></div>
          </div>}
        </section>

        {mode === 'professional' && <>
          <section className="ec-section" aria-labelledby="ec-section-stack">
            <div className="ec-section-head">
              <div className="ec-section-title"><span className="ec-section-icon"><Icon name="layers" /></span><div><h3 id="ec-section-stack">开发栈</h3><p>让 DeepSeek 决策，或指定工程边界</p></div></div>
              <span className="ec-section-meta">技术约束</span>
            </div>
            <div className="ec-field">
              <label className="ec-label" htmlFor="ec-stack">技术栈</label>
              <select id="ec-stack" className="ec-select" aria-label="技术栈" value={stack} onChange={event => { setStack(event.target.value as AppStack); setShowValidationSummary(false) }}>
                {STACK_GROUPS.map(group => <optgroup key={group.label} label={group.label}>{group.items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>)}
              </select>
              <p className="ec-help">自动决策会综合产品形态、维护成本、部署条件和你的目标。</p>
            </div>
            {stack === 'custom' && <div className="ec-field">
              <label className="ec-label" htmlFor="ec-stack-detail">自定义技术栈 <span className="ec-required" aria-hidden="true">*</span></label>
              <input id="ec-stack-detail" className="ec-input" aria-label="自定义技术栈" aria-invalid={visibleError('stackDetail') !== undefined} aria-describedby="ec-stack-detail-error" value={stackDetail} maxLength={300} onBlur={() => touch('stackDetail')} onChange={event => setStackDetail(event.target.value)} placeholder="例如：Elixir + Phoenix LiveView" required />
              <p className="ec-field-error" id="ec-stack-detail-error" aria-live="polite">{visibleError('stackDetail') ?? ''}</p>
            </div>}
            <p className="ec-decision-note"><Icon name="info" size={16} /><span>这些选项会成为 DeepSeek 的工程约束。Go 模式继续生成与验证，Plan 模式只产出可执行方案。</span></p>
          </section>

          <section className="ec-section" aria-labelledby="ec-section-execution">
            <div className="ec-section-head">
              <div className="ec-section-title"><span className="ec-section-icon"><Icon name="terminal" /></span><div><h3 id="ec-section-execution">执行策略</h3><p>选择开发位置与交付深度</p></div></div>
              <span className="ec-section-meta">环境与工作流</span>
            </div>
            <div className="ec-grid-2">
              <div className="ec-field">
                <label className="ec-label" htmlFor="ec-environment">开发环境</label>
                <select id="ec-environment" className="ec-select" aria-label="开发环境" value={environment} onChange={event => { setEnvironment(event.target.value as DevEnvironment); setShowValidationSummary(false) }}>{ENVIRONMENT_GROUPS.map(group => <optgroup key={group.label} label={group.label}>{group.items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>)}</select>
                <p className="ec-help">本机、容器、远程与云端环境均可作为约束。</p>
              </div>
              <div className="ec-field">
                <label className="ec-label" htmlFor="ec-workflow">工作流</label>
                <select id="ec-workflow" className="ec-select" aria-label="工作流" value={workflow} onChange={event => setWorkflow(event.target.value as WorkflowMode)}><option value="go">Go：生成并验证应用</option><option value="plan">Plan：只完善规划</option></select>
                <p className="ec-help">Plan 不写应用代码；Go 会继续落地实现。</p>
              </div>
            </div>
            {environment === 'custom' && <div className="ec-field">
              <label className="ec-label" htmlFor="ec-environment-detail">自定义开发环境 <span className="ec-required" aria-hidden="true">*</span></label>
              <input id="ec-environment-detail" className="ec-input" aria-label="自定义开发环境" aria-invalid={visibleError('environmentDetail') !== undefined} aria-describedby="ec-environment-detail-error" value={environmentDetail} maxLength={300} onBlur={() => touch('environmentDetail')} onChange={event => setEnvironmentDetail(event.target.value)} placeholder="例如：内网 Linux 构建机 + 自托管 Runner" required />
              <p className="ec-field-error" id="ec-environment-detail-error" aria-live="polite">{visibleError('environmentDetail') ?? ''}</p>
            </div>}
            <div className="ec-switch-row"><div className="ec-switch-copy"><strong>初始化 Git 仓库</strong><span>创建 main 分支，不自动提交，也不会推送远端。</span></div><Toggle checked={initializeGit} onChange={setInitializeGit} label="初始化 Git 仓库" /></div>
          </section>

          <section className="ec-section" aria-labelledby="ec-section-design">
            <div className="ec-section-head">
              <div className="ec-section-title"><span className="ec-section-icon"><Icon name="palette" /></span><div><h3 id="ec-section-design">设计目标</h3><p>定义产品应有的视觉与体验感受</p></div></div>
              <span className="ec-section-meta">最多 2000 字</span>
            </div>
            <div className="ec-field">
              <label className="ec-label" htmlFor="ec-design-goal">你希望产品给人什么感受？</label>
              <textarea id="ec-design-goal" className="ec-textarea" value={designGoal} maxLength={2000} onChange={event => setDesignGoal(event.target.value)} placeholder="例如：工具感强、信息密度适中、移动端优先" />
              <p className="ec-help">可以描述风格、目标用户、关键页面、响应式与无障碍要求。</p>
            </div>
          </section>

          <section className="ec-section" aria-labelledby="ec-section-mcp">
            <div className="ec-section-head">
              <div className="ec-section-title"><span className="ec-section-icon"><Icon name="plug" /></span><div><h3 id="ec-section-mcp">MCP</h3><p>按需连接你已经确认的工具</p></div></div>
              <span className="ec-section-meta">可选能力</span>
            </div>
            <div className="ec-switch-row"><div className="ec-switch-copy"><strong>启用手动 MCP 配置</strong><span>把你确认过的服务器配置写入项目 .mcp.json。</span></div><Toggle checked={mcpEnabled} onChange={value => { setMcpEnabled(value); setShowValidationSummary(false) }} label="启用 MCP" /></div>
            <div className="ec-switch-row"><div className="ec-switch-copy"><strong>自动搜寻合适的 MCP <span className="ec-wip">WIP</span></strong><span>首版不联网、不安装，也不会修改你的 MCP 列表。</span></div><Toggle checked={false} onChange={() => undefined} label="自动搜寻 MCP，开发中" disabled /></div>
            {mcpEnabled && <div className="ec-field">
              <label className="ec-label" htmlFor="ec-mcp-json">MCP servers JSON</label>
              <textarea id="ec-mcp-json" className="ec-textarea ec-code" aria-label="MCP servers JSON" aria-invalid={visibleError('mcpJson') !== undefined} value={mcpJson} onBlur={() => touch('mcpJson')} onChange={event => setMcpJson(event.target.value)} spellCheck={false} aria-describedby="ec-mcp-help ec-mcp-error" />
              <p className="ec-help" id="ec-mcp-help">填写 mcpServers 对象，例如 {`{ "my-server": { "command": "...", "args": [] } }`}。</p>
              <p className="ec-field-error" id="ec-mcp-error" aria-live="polite">{visibleError('mcpJson') ?? ''}</p>
            </div>}
          </section>
        </>}
      </div>

      <aside className="ec-summary" aria-label="本次创建摘要">
        <div className="ec-summary-head"><div><h3>本次创建</h3><p className="ec-summary-subtitle">提交前可随时调整</p></div><span className="ec-summary-mode">{mode === 'simple' ? '简易' : '专业'}</span></div>
        <dl>
          <div><dt>项目</dt><dd>{projectName || '未命名'}</dd></div>
          <div><dt>技术栈</dt><dd>{effective.stack === 'custom' ? stackDetail || '待填写' : stackName(effective.stack)}</dd></div>
          <div><dt>环境</dt><dd>{effective.environment === 'custom' ? environmentDetail || '待填写' : environmentName(effective.environment)}</dd></div>
          <div><dt>工作流</dt><dd>{effective.workflow === 'plan' ? 'Plan' : 'Go'}</dd></div>
          <div><dt>Git</dt><dd>{effective.git ? '初始化' : '不初始化'}</dd></div>
          <div><dt>MCP</dt><dd>{effective.mcp ? '手动配置' : '关闭'}</dd></div>
        </dl>
        <div className="ec-action">
          <button className="ec-button" type="submit" disabled={submitting}>{submitting && <span className="ec-spinner" aria-hidden="true" />}{submitLabel}{!submitting && <Icon name="arrow" size={16} />}</button>
          <p className="ec-footnote">只写入 EasyCode 输出目录，随后在 Harness 中打开开发任务；同名目录不会被覆盖。</p>
          {error && <p className="ec-error" role="alert">{error}</p>}
          {result && <div className="ec-result" aria-live="polite"><strong><Icon name="check" size={15} />{handoffState === 'sent' ? '已交给 DeepSeek' : handoffState === 'failed' ? '项目已准备，等待手动继续' : '项目工作区已准备'}</strong><p className="ec-path">{result.outputPath}</p><button className="ec-copy" type="button" onClick={copyPath}><Icon name="copy" size={14} />{copied ? '已复制' : '复制路径'}</button></div>}
        </div>
      </aside>
    </form>
  </div>
}

export const inject = ['slots', 'locale', 'workspaces', 'sessions', 'conversation']

export function apply(ctx: ClientContext): void {
  ctx.effect(ensureStyles, 'easycode: styles')
  ctx.effect(() => ctx.locale.register(NS, copy), 'easycode: dictionaries')
  const t = ctx.locale.bind(NS)
  const handoff: EasyCodeHandoff = async (outputPath, prompt) => {
    const workspace = await ctx.workspaces.create({ path: outputPath })
    const sessionId = await ctx.workspaces.connectWorkspace(workspace.workspaceId)
    ctx.sessions.open(sessionId)
    const conversation = ctx.sessions.scope(sessionId)?.get('conversation')
    if (conversation === undefined) throw new Error('当前工作区没有可用的会话服务')
    await conversation.send(prompt)
  }
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'easycode',
    order: 15,
    label: () => t('nav'),
    inject: () => ({ handoff }),
  }, EasyCodeWizard))
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'easycode',
    order: -10,
    locale: NS,
  }, EasyCodeLauncher))
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'easycode',
    order: 10,
    locale: NS,
    inject: () => ({ handoff }),
  }, EasyCodeOverlay))
}
