window.__ModuleLoader__.load({ id: "dsh-easycode", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
let react = require("react");
react = __toESM(react);
let react_jsx_runtime = require("react/jsx-runtime");
react_jsx_runtime = __toESM(react_jsx_runtime);

//#region src/client/index.tsx
const PLUGIN_ID = "dsh-easycode";
const NS = "easycode";
const copy = {
	zh: {
		nav: "EasyCode",
		launch: "EasyCode",
		dialogLabel: "创建应用",
		dialogHint: "从首页直接开始",
		close: "关闭"
	},
	en: {
		nav: "EasyCode",
		launch: "EasyCode",
		dialogLabel: "Create app",
		dialogHint: "Start directly from Home",
		close: "Close"
	}
};
const OPEN_EASYCODE_EVENT = "easycode:open";
const CLOSE_EASYCODE_EVENT = "easycode:close";
const STACK_GROUPS = [
	{
		label: "智能决策",
		items: [{
			id: "auto",
			name: "DeepSeek 自动决策（推荐）"
		}]
	},
	{
		label: "前端与内容站点",
		items: [
			{
				id: "vanilla",
				name: "Vanilla JavaScript + Vite"
			},
			{
				id: "react-vite",
				name: "React + Vite"
			},
			{
				id: "vue-vite",
				name: "Vue + Vite"
			},
			{
				id: "svelte-vite",
				name: "Svelte + Vite"
			},
			{
				id: "solid-vite",
				name: "SolidJS + Vite"
			},
			{
				id: "angular",
				name: "Angular"
			},
			{
				id: "astro",
				name: "Astro"
			},
			{
				id: "qwik",
				name: "Qwik"
			}
		]
	},
	{
		label: "全栈 Web",
		items: [
			{
				id: "nextjs",
				name: "Next.js"
			},
			{
				id: "nuxt",
				name: "Nuxt"
			},
			{
				id: "remix",
				name: "Remix"
			},
			{
				id: "sveltekit",
				name: "SvelteKit"
			},
			{
				id: "tanstack-start",
				name: "TanStack Start"
			}
		]
	},
	{
		label: "后端与 API",
		items: [
			{
				id: "node-api",
				name: "Node.js API"
			},
			{
				id: "express",
				name: "Express"
			},
			{
				id: "fastify",
				name: "Fastify"
			},
			{
				id: "nestjs",
				name: "NestJS"
			},
			{
				id: "hono",
				name: "Hono"
			},
			{
				id: "bun-api",
				name: "Bun API"
			},
			{
				id: "deno-api",
				name: "Deno API"
			},
			{
				id: "python-fastapi",
				name: "Python + FastAPI"
			},
			{
				id: "python-django",
				name: "Python + Django"
			},
			{
				id: "go-api",
				name: "Go API"
			},
			{
				id: "rust-axum",
				name: "Rust + Axum"
			},
			{
				id: "java-spring",
				name: "Java + Spring Boot"
			},
			{
				id: "kotlin-ktor",
				name: "Kotlin + Ktor"
			},
			{
				id: "dotnet-api",
				name: ".NET Web API"
			},
			{
				id: "php-laravel",
				name: "PHP + Laravel"
			},
			{
				id: "ruby-rails",
				name: "Ruby on Rails"
			}
		]
	},
	{
		label: "桌面、移动端与扩展",
		items: [
			{
				id: "electron",
				name: "Electron"
			},
			{
				id: "tauri",
				name: "Tauri"
			},
			{
				id: "react-native",
				name: "React Native"
			},
			{
				id: "expo",
				name: "Expo"
			},
			{
				id: "flutter",
				name: "Flutter"
			},
			{
				id: "browser-extension",
				name: "浏览器扩展"
			}
		]
	},
	{
		label: "其他",
		items: [{
			id: "custom",
			name: "自定义技术栈…"
		}]
	}
];
const ENVIRONMENT_GROUPS = [
	{
		label: "智能决策",
		items: [{
			id: "auto",
			name: "DeepSeek 自动决策（推荐）"
		}]
	},
	{
		label: "本机与容器",
		items: [
			{
				id: "local",
				name: "本地开发"
			},
			{
				id: "docker",
				name: "Docker"
			},
			{
				id: "podman",
				name: "Podman"
			},
			{
				id: "devcontainer",
				name: "Dev Container"
			},
			{
				id: "wsl",
				name: "WSL"
			},
			{
				id: "nix",
				name: "Nix / devenv"
			}
		]
	},
	{
		label: "远程与云端",
		items: [
			{
				id: "remote-ssh",
				name: "远程 SSH"
			},
			{
				id: "codespaces",
				name: "GitHub Codespaces"
			},
			{
				id: "kubernetes",
				name: "Kubernetes 开发环境"
			}
		]
	},
	{
		label: "其他",
		items: [{
			id: "custom",
			name: "自定义开发环境…"
		}]
	}
];
const STACKS = STACK_GROUPS.flatMap((group) => group.items);
const ENVIRONMENTS = ENVIRONMENT_GROUPS.flatMap((group) => group.items);
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
  --ec-canvas: #0f172a;
  --ec-panel: #172033;
  --ec-panel-raised: #1b263b;
  --ec-panel-soft: #152e2b;
  --ec-text: #f8fafc;
  --ec-muted: #b2bfcc;
  --ec-faint: #94a3b8;
  --ec-border: #334155;
  --ec-border-strong: #4b5d73;
  --ec-accent: #22c55e;
  --ec-accent-strong: #4ade80;
  --ec-accent-soft: #173b2b;
  --ec-accent-contrast: #052e16;
  --ec-switch-off: #526174;
  --ec-warn: #f5c56b;
  --ec-warn-soft: #3a2c18;
  --ec-error: #ffaaa4;
  --ec-error-soft: #3e2327;
  --ec-success: #79dda5;
  --ec-shadow-sm: 0 1px 2px rgba(0, 0, 0, .24);
  --ec-shadow-md: 0 24px 64px rgba(0, 0, 0, .34);
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

.ec-progress { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 0 4px 24px; padding-top: 18px; border-top: 1px solid var(--ec-border); list-style: none; counter-reset: ec-step; }
.ec-progress li { display: flex; align-items: center; gap: 9px; min-width: 0; color: var(--ec-faint); font-size: 12px; }
.ec-progress li::before { counter-increment: ec-step; content: counter(ec-step); display: grid; place-items: center; flex: 0 0 24px; width: 24px; height: 24px; border: 1px solid var(--ec-border); border-radius: 50%; background: var(--ec-panel); color: var(--ec-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10px; }
.ec-progress li:first-child { color: var(--ec-text); font-weight: 650; }
.ec-progress li:first-child::before { border-color: var(--ec-accent); background: var(--ec-accent); color: var(--ec-accent-contrast); }

.ec-mode-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 0 0 26px; }
.ec-mode { position: relative; min-height: 176px; border: 1px solid var(--ec-border); border-radius: 16px; background: var(--ec-panel); color: inherit; padding: 18px; text-align: left; cursor: pointer; box-shadow: var(--ec-shadow-sm); transition: border-color 160ms ease, box-shadow 180ms ease, transform 120ms ease, background 180ms ease; touch-action: manipulation; }
.ec-mode:hover { border-color: var(--ec-border-strong); box-shadow: 0 10px 28px rgba(16, 43, 35, .09); }
.ec-mode:active { transform: scale(.99); }
.ec-mode[data-active='true'] { border-color: var(--ec-accent); background: linear-gradient(135deg, var(--ec-accent-soft), var(--ec-panel) 72%); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ec-accent) 22%, transparent), var(--ec-shadow-sm); }
.ec-mode-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.ec-mode-icon { display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid var(--ec-border); border-radius: 11px; background: var(--ec-canvas); color: var(--ec-muted); }
.ec-mode[data-active='true'] .ec-mode-icon { border-color: color-mix(in srgb, var(--ec-accent) 45%, var(--ec-border)); background: var(--ec-accent); color: var(--ec-accent-contrast); }
.ec-mode-badge { display: inline-flex; align-items: center; min-height: 24px; border: 1px solid var(--ec-border); border-radius: 999px; padding: 3px 8px; color: var(--ec-muted); font-size: 10px; font-weight: 680; }
.ec-mode strong { display: block; margin-top: 14px; font-size: 17px; letter-spacing: -.015em; }
.ec-mode > span { display: block; margin-top: 7px; color: var(--ec-muted); font-size: 13px; line-height: 1.55; }
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
.ec-switch { position: relative; width: 46px; height: 28px; border: 0; border-radius: 999px; background: var(--ec-switch-off); cursor: pointer; transition: background 150ms ease, box-shadow 150ms ease; touch-action: manipulation; }
.ec-switch::after { content: ''; position: absolute; top: 4px; left: 4px; width: 20px; height: 20px; border-radius: 50%; background: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, .22); transition: transform 160ms cubic-bezier(.2, .8, .2, 1); }
.ec-switch[aria-checked='true'] { background: var(--ec-accent); }
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
.ec-overlay-logo { display: grid; place-items: center; flex: 0 0 auto; width: 32px; height: 32px; border: 1px solid rgba(23, 122, 98, .4); border-radius: 9px; background: rgba(23, 122, 98, .12); color: #177a62; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10px; font-weight: 800; }
body[data-ds-dark-theme] .ec-overlay-logo { color: #4ade80; border-color: rgba(74, 222, 128, .42); background: rgba(74, 222, 128, .12); }
.ec-overlay-brand-copy { min-width: 0; }
.ec-overlay-brand strong { display: block; font-size: 14px; line-height: 1.3; }
.ec-overlay-brand span { display: block; margin-top: 2px; color: var(--dsw-alias-label-tertiary, #69716e); font-size: 10px; }
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
  .ec-progress { grid-template-columns: 1fr; gap: 6px; }
  .ec-progress li:not(:first-child) { display: none; }
  .ec-mode-grid, .ec-grid-2, .ec-auto-plan { grid-template-columns: 1fr; }
  .ec-mode { min-height: 164px; }
}
@media (max-width: 560px) {
  .ec-overlay { padding: 0; backdrop-filter: none; }
  .ec-overlay-panel { width: 100%; height: 100%; max-height: 100%; border: 0; border-radius: 0; animation: none; }
  .ec-overlay-head { padding-inline: 14px; }
  .ec-overlay-body { padding: 18px 14px 0; }
  .ec-overlay-brand span { display: none; }
  .ec-root { padding-bottom: max(32px, env(safe-area-inset-bottom)); }
  .ec-hero { grid-template-columns: 1fr; gap: 16px; padding-top: 4px; }
  .ec-version { justify-self: start; }
  .ec-title { font-size: clamp(32px, 11vw, 44px); }
  .ec-intro { font-size: 14px; }
  .ec-section { padding: 16px; }
  .ec-section-head { align-items: flex-start; }
  .ec-section-meta { display: none; }
  .ec-input, .ec-textarea, .ec-select { font-size: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .ec-root *, .ec-root *::before, .ec-root *::after, .ec-overlay-panel { animation: none !important; scroll-behavior: auto !important; transition: none !important; }
}
`;
function ensureStyles() {
	if (document.querySelector(`style[data-plugin="${PLUGIN_ID}"]`) !== null) return () => void 0;
	const style = document.createElement("style");
	style.dataset.plugin = PLUGIN_ID;
	style.textContent = STYLES;
	document.head.append(style);
	return () => style.remove();
}
function Icon({ name, size = 18 }) {
	const paths = {
		sparkles: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m12 3 1.35 3.65L17 8l-3.65 1.35L12 13l-1.35-3.65L7 8l3.65-1.35L12 3Z" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m19 12 .65 1.35L21 14l-1.35.65L19 16l-.65-1.35L17 14l1.35-.65L19 12Z" })
		] }),
		sliders: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 7h10" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M18 7h2" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 17h2" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M10 17h10" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "7",
				r: "2"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "17",
				r: "2"
			})
		] }),
		folder: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" }),
		layers: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m12 3-9 5 9 5 9-5-9-5Z" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m3 12 9 5 9-5" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m3 16 9 5 9-5" })
		] }),
		terminal: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m5 7 4 4-4 4" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M11 17h8" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
				x: "3",
				y: "4",
				width: "18",
				height: "16",
				rx: "2"
			})
		] }),
		palette: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "12",
				r: "9"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "9",
				r: "1"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "7",
				r: "1"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "9",
				r: "1"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M15 16c0 1.1-.9 2-2 2h-1a2 2 0 0 1 0-4h1a2 2 0 0 1 2 2Z" })
		] }),
		plug: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 3v5" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M16 3v5" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M6 8h12v2a6 6 0 0 1-12 0V8Z" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 16v5" })
		] }),
		arrow: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M5 12h14" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m14 7 5 5-5 5" })] }),
		check: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m5 12 4 4L19 6" }),
		info: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "12",
				r: "9"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 11v5" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 8h.01" })
		] }),
		copy: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
			x: "8",
			y: "8",
			width: "11",
			height: "11",
			rx: "2"
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" })] }),
		close: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m6 6 12 12" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M18 6 6 18" })] })
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		"aria-hidden": "true",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: paths[name]
	});
}
function EasyCodeLauncher({ wide, t }) {
	function open(event) {
		window.dispatchEvent(new CustomEvent(OPEN_EASYCODE_EVENT, { detail: { returnFocus: event.currentTarget } }));
	}
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
		className: "ec-launcher",
		type: "button",
		"data-wide": String(wide),
		"aria-label": t("launch"),
		title: wide ? void 0 : t("launch"),
		onClick: open,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: "ec-launcher-mark",
			"aria-hidden": "true",
			children: "EC"
		}), wide && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: "ec-launcher-label",
			children: t("launch")
		})]
	});
}
function EasyCodeOverlay({ t, handoff }) {
	const [open, setOpen] = (0, react.useState)(false);
	const closeRef = (0, react.useRef)(null);
	const panelRef = (0, react.useRef)(null);
	const returnFocusRef = (0, react.useRef)(null);
	function close() {
		setOpen(false);
		queueMicrotask(() => returnFocusRef.current?.focus());
	}
	(0, react.useEffect)(() => {
		const handleOpen = (event) => {
			returnFocusRef.current = event.detail?.returnFocus ?? document.activeElement;
			setOpen(true);
		};
		window.addEventListener(OPEN_EASYCODE_EVENT, handleOpen);
		window.addEventListener(CLOSE_EASYCODE_EVENT, close);
		return () => {
			window.removeEventListener(OPEN_EASYCODE_EVENT, handleOpen);
			window.removeEventListener(CLOSE_EASYCODE_EVENT, close);
		};
	}, []);
	(0, react.useEffect)(() => {
		if (!open) return;
		closeRef.current?.focus();
		const handleKeydown = (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				close();
				return;
			}
			if (event.key === "Tab") {
				const focusable = Array.from(panelRef.current?.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex=\"-1\"])") ?? []);
				const first = focusable[0];
				const last = focusable.at(-1);
				if (first === void 0 || last === void 0) return;
				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault();
					last.focus();
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault();
					first.focus();
				}
			}
		};
		window.addEventListener("keydown", handleKeydown);
		return () => window.removeEventListener("keydown", handleKeydown);
	}, [open]);
	if (!open) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "ec-overlay",
		onMouseDown: (event) => {
			if (event.target === event.currentTarget) close();
		},
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			ref: panelRef,
			className: "ec-overlay-panel",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "ec-overlay-title",
			"aria-describedby": "ec-overlay-hint",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
				className: "ec-overlay-head",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "ec-overlay-brand",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "ec-overlay-logo",
						"aria-hidden": "true",
						children: "EC"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "ec-overlay-brand-copy",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", {
							id: "ec-overlay-title",
							children: t("dialogLabel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							id: "ec-overlay-hint",
							children: t("dialogHint")
						})]
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					ref: closeRef,
					className: "ec-overlay-close",
					type: "button",
					"aria-label": t("close"),
					title: t("close"),
					onClick: close,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
						name: "close",
						size: 19
					})
				})]
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "ec-overlay-body",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EasyCodeWizard, { handoff })
			})]
		})
	});
}
function Toggle({ checked, onChange, label, disabled = false }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
		className: "ec-switch",
		type: "button",
		role: "switch",
		"aria-label": label,
		"aria-checked": checked,
		disabled,
		onClick: () => onChange(!checked)
	});
}
function slugFromTopic(value) {
	return value.toLowerCase().trim().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "my-app";
}
function stackName(stack) {
	return STACKS.find((item) => item.id === stack)?.name ?? stack;
}
function environmentName(environment) {
	return ENVIRONMENTS.find((item) => item.id === environment)?.name ?? environment;
}
function agentPrompt(config) {
	return `这是 EasyCode 创建的项目。请先完整读取 EASYCODE.md、PLAN.md 和 README.md，再继续开发。${config.workflow === "plan" ? "保持 Plan 模式：只完善需求、架构、任务拆分、风险与验收标准，不实现应用代码。" : "进入 Go 模式：实现完整、可运行的应用，执行适合所选技术栈的检查并修复发现的问题。"}不要自动搜索或安装 MCP；该能力在 EasyCode v1 中仍为 WIP。`;
}
function validateMcpJson(value) {
	try {
		const parsed = JSON.parse(value);
		if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return "请输入 JSON 对象，例如 { \"server\": { \"command\": \"...\" } }。";
		return;
	} catch {
		return "JSON 格式不完整，请检查引号、逗号和括号。";
	}
}
function EasyCodeWizard({ handoff }) {
	const [mode, setMode] = (0, react.useState)("simple");
	const [projectName, setProjectName] = (0, react.useState)("my-app");
	const [topic, setTopic] = (0, react.useState)("");
	const [stack, setStack] = (0, react.useState)("auto");
	const [stackDetail, setStackDetail] = (0, react.useState)("");
	const [environment, setEnvironment] = (0, react.useState)("auto");
	const [environmentDetail, setEnvironmentDetail] = (0, react.useState)("");
	const [initializeGit, setInitializeGit] = (0, react.useState)(true);
	const [workflow, setWorkflow] = (0, react.useState)("go");
	const [designGoal, setDesignGoal] = (0, react.useState)("清晰、快速、移动端可用");
	const [mcpEnabled, setMcpEnabled] = (0, react.useState)(false);
	const [mcpJson, setMcpJson] = (0, react.useState)("{}");
	const [submitting, setSubmitting] = (0, react.useState)(false);
	const [error, setError] = (0, react.useState)("");
	const [result, setResult] = (0, react.useState)(null);
	const [handoffState, setHandoffState] = (0, react.useState)("idle");
	const [copied, setCopied] = (0, react.useState)(false);
	const [touched, setTouched] = (0, react.useState)({});
	const [showValidationSummary, setShowValidationSummary] = (0, react.useState)(false);
	const errorSummaryRef = (0, react.useRef)(null);
	const effective = (0, react.useMemo)(() => mode === "simple" ? {
		stack: "auto",
		environment: "auto",
		workflow: "go",
		git: false,
		mcp: false
	} : {
		stack,
		environment,
		workflow,
		git: initializeGit,
		mcp: mcpEnabled
	}, [
		mode,
		stack,
		environment,
		workflow,
		initializeGit,
		mcpEnabled
	]);
	const validationErrors = (0, react.useMemo)(() => {
		const next = {};
		if (!projectName.trim()) next.projectName = "请填写项目名称。";
		if (!topic.trim()) next.topic = "请用一句话描述要创建的应用。";
		if (mode === "professional" && stack === "custom" && !stackDetail.trim()) next.stackDetail = "请填写自定义技术栈。";
		if (mode === "professional" && environment === "custom" && !environmentDetail.trim()) next.environmentDetail = "请填写自定义开发环境。";
		if (mode === "professional" && mcpEnabled) {
			const mcpError = validateMcpJson(mcpJson);
			if (mcpError !== void 0) next.mcpJson = mcpError;
		}
		return next;
	}, [
		projectName,
		topic,
		mode,
		stack,
		stackDetail,
		environment,
		environmentDetail,
		mcpEnabled,
		mcpJson
	]);
	function touch(field) {
		setTouched((current) => ({
			...current,
			[field]: true
		}));
	}
	function visibleError(field) {
		return touched[field] === true ? validationErrors[field] : void 0;
	}
	function chooseMode(next) {
		setMode(next);
		setError("");
		setResult(null);
		setHandoffState("idle");
		setTouched({});
		setShowValidationSummary(false);
	}
	async function submit(event) {
		event.preventDefault();
		setError("");
		setResult(null);
		setHandoffState("idle");
		setCopied(false);
		const fields = ["projectName", "topic"];
		if (mode === "professional" && effective.stack === "custom") fields.push("stackDetail");
		if (mode === "professional" && effective.environment === "custom") fields.push("environmentDetail");
		if (mode === "professional" && effective.mcp) fields.push("mcpJson");
		setTouched(Object.fromEntries(fields.map((field) => [field, true])));
		if (fields.some((field) => validationErrors[field] !== void 0)) {
			setShowValidationSummary(true);
			queueMicrotask(() => errorSummaryRef.current?.focus());
			return;
		}
		setShowValidationSummary(false);
		let mcpServers = {};
		if (effective.mcp) mcpServers = JSON.parse(mcpJson);
		const payload = {
			mode,
			projectName: projectName.trim(),
			topic: topic.trim(),
			stack: effective.stack,
			stackDetail: mode === "professional" && effective.stack === "custom" ? stackDetail.trim() : "",
			environment: effective.environment,
			environmentDetail: mode === "professional" && effective.environment === "custom" ? environmentDetail.trim() : "",
			initializeGit: effective.git,
			workflow: effective.workflow,
			designGoal: mode === "simple" ? "" : designGoal.trim(),
			mcpEnabled: effective.mcp,
			mcpServers
		};
		setSubmitting(true);
		try {
			const response = await fetch("/easycode/api/projects", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-easycode-request": "1"
				},
				body: JSON.stringify(payload)
			});
			const data = await response.json();
			if (!response.ok || !data.ok) throw new Error(data.ok ? "创建项目失败" : data.error);
			setResult(data);
			setHandoffState("sending");
			try {
				await handoff(data.outputPath, agentPrompt(payload));
				setHandoffState("sent");
				window.dispatchEvent(new Event(CLOSE_EASYCODE_EVENT));
			} catch (cause) {
				setHandoffState("failed");
				setError(`项目目录已创建，但无法启动 DeepSeek 开发会话：${cause instanceof Error ? cause.message : "未知错误"}`);
			}
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "创建项目失败，请稍后重试。");
		} finally {
			setSubmitting(false);
		}
	}
	async function copyPath() {
		if (result === null) return;
		try {
			await navigator.clipboard.writeText(result.outputPath);
			setCopied(true);
		} catch {
			setError("无法访问剪贴板，请手动复制项目路径。");
		}
	}
	const submitLabel = submitting ? handoffState === "sending" ? "正在交给 DeepSeek…" : "正在准备项目…" : effective.workflow === "plan" ? "让 DeepSeek 制定计划" : "让 DeepSeek 创建应用";
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "ec-root",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
				className: "ec-hero",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "ec-kicker",
						children: "Click to build"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
						className: "ec-title",
						children: "把想法变成可运行的应用。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "ec-intro",
						children: "描述目标，选择需要的控制粒度。EasyCode 会准备安全的本地工作区，再由 DeepSeek 决策技术路线、生成代码并继续开发。"
					})
				] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "ec-version",
					children: "v0.1"
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("ol", {
				className: "ec-progress",
				"aria-label": "创建流程",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: "描述产品想法" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: "确认工程约束" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: "交给 DeepSeek" })
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "ec-mode-grid",
				role: "group",
				"aria-label": "创建模式",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					className: "ec-mode",
					type: "button",
					"aria-label": "简易模式",
					"aria-pressed": mode === "simple",
					"data-active": mode === "simple",
					onClick: () => chooseMode("simple"),
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "ec-mode-top",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "ec-mode-icon",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "sparkles",
									size: 20
								})
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "ec-mode-badge",
								children: "最快开始"
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "简易模式" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "只描述要做什么，技术路线与执行细节交给 DeepSeek。" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "ec-mode-features",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "零配置" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "自动决策" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "直接创建" })
							]
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					className: "ec-mode",
					type: "button",
					"aria-label": "专业模式",
					"aria-pressed": mode === "professional",
					"data-active": mode === "professional",
					onClick: () => chooseMode("professional"),
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "ec-mode-top",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "ec-mode-icon",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "sliders",
									size: 20
								})
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "ec-mode-badge",
								children: "完整控制"
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "专业模式" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "指定技术栈、环境、Git、工作流、设计目标与 MCP。" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "ec-mode-features",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "工程约束" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Plan / Go" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "手动 MCP" })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
				className: "ec-layout",
				noValidate: true,
				onSubmit: submit,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "ec-form",
					children: [
						showValidationSummary && Object.keys(validationErrors).length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							ref: errorSummaryRef,
							className: "ec-error-summary",
							role: "alert",
							tabIndex: -1,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "还差一点信息" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "请检查下方标记的字段，修正后即可继续创建。" })]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: "ec-section",
							"aria-labelledby": "ec-section-project",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ec-section-head",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-section-title",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "ec-section-icon",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "folder" })
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
											id: "ec-section-project",
											children: "项目基础"
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "告诉 DeepSeek 要创建什么" })] })]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "ec-section-meta",
										children: "必填"
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ec-grid-2",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-field",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
												className: "ec-label",
												htmlFor: "ec-project-name",
												children: ["项目名称 ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "ec-required",
													"aria-hidden": "true",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
												id: "ec-project-name",
												className: "ec-input",
												"aria-label": "项目名称",
												"aria-invalid": visibleError("projectName") !== void 0,
												"aria-describedby": "ec-project-help ec-project-error",
												value: projectName,
												maxLength: 64,
												onBlur: () => touch("projectName"),
												onChange: (event) => setProjectName(event.target.value),
												placeholder: "my-app",
												autoComplete: "off",
												required: true
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "ec-help",
												id: "ec-project-help",
												children: "将作为本地目录名，不会覆盖同名目录。"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "ec-field-error",
												id: "ec-project-error",
												"aria-live": "polite",
												children: visibleError("projectName") ?? ""
											})
										]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-field",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
												className: "ec-label",
												htmlFor: "ec-topic",
												children: ["一句话主题 ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "ec-required",
													"aria-hidden": "true",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
												id: "ec-topic",
												className: "ec-input",
												"aria-label": "一句话主题",
												"aria-invalid": visibleError("topic") !== void 0,
												"aria-describedby": "ec-topic-help ec-topic-error",
												value: topic,
												maxLength: 2e3,
												onBlur: () => touch("topic"),
												onChange: (event) => {
													const next = event.target.value;
													setTopic(next);
													if (projectName === "my-app" && next.trim()) setProjectName(slugFromTopic(next));
												},
												placeholder: "例如：给独立开发者使用的待办应用",
												autoComplete: "off",
												required: true
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "ec-help",
												id: "ec-topic-help",
												children: "写清用户、场景和目标，生成结果会更准确。"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "ec-field-error",
												id: "ec-topic-error",
												"aria-live": "polite",
												children: visibleError("topic") ?? ""
											})
										]
									})]
								}),
								mode === "simple" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ec-auto-plan",
									"aria-label": "简易模式自动完成的工作",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "技术方案" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "根据产品目标自动选择" })] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "开发环境" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "采用最合适的本地方案" })] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "执行方式" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "进入 Go 模式生成并验证" })] })
									]
								})
							]
						}),
						mode === "professional" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: "ec-section",
								"aria-labelledby": "ec-section-stack",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-section-head",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ec-section-title",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "ec-section-icon",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "layers" })
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
												id: "ec-section-stack",
												children: "开发栈"
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "让 DeepSeek 决策，或指定工程边界" })] })]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "ec-section-meta",
											children: "技术约束"
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-field",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
												className: "ec-label",
												htmlFor: "ec-stack",
												children: "技术栈"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
												id: "ec-stack",
												className: "ec-select",
												"aria-label": "技术栈",
												value: stack,
												onChange: (event) => {
													setStack(event.target.value);
													setShowValidationSummary(false);
												},
												children: STACK_GROUPS.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("optgroup", {
													label: group.label,
													children: group.items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: item.id,
														children: item.name
													}, item.id))
												}, group.label))
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "ec-help",
												children: "自动决策会综合产品形态、维护成本、部署条件和你的目标。"
											})
										]
									}),
									stack === "custom" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-field",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
												className: "ec-label",
												htmlFor: "ec-stack-detail",
												children: ["自定义技术栈 ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "ec-required",
													"aria-hidden": "true",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
												id: "ec-stack-detail",
												className: "ec-input",
												"aria-label": "自定义技术栈",
												"aria-invalid": visibleError("stackDetail") !== void 0,
												"aria-describedby": "ec-stack-detail-error",
												value: stackDetail,
												maxLength: 300,
												onBlur: () => touch("stackDetail"),
												onChange: (event) => setStackDetail(event.target.value),
												placeholder: "例如：Elixir + Phoenix LiveView",
												required: true
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "ec-field-error",
												id: "ec-stack-detail-error",
												"aria-live": "polite",
												children: visibleError("stackDetail") ?? ""
											})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
										className: "ec-decision-note",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "info",
											size: 16
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "这些选项会成为 DeepSeek 的工程约束。Go 模式继续生成与验证，Plan 模式只产出可执行方案。" })]
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: "ec-section",
								"aria-labelledby": "ec-section-execution",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-section-head",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ec-section-title",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "ec-section-icon",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "terminal" })
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
												id: "ec-section-execution",
												children: "执行策略"
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "选择开发位置与交付深度" })] })]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "ec-section-meta",
											children: "环境与工作流"
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-grid-2",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ec-field",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
													className: "ec-label",
													htmlFor: "ec-environment",
													children: "开发环境"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
													id: "ec-environment",
													className: "ec-select",
													"aria-label": "开发环境",
													value: environment,
													onChange: (event) => {
														setEnvironment(event.target.value);
														setShowValidationSummary(false);
													},
													children: ENVIRONMENT_GROUPS.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("optgroup", {
														label: group.label,
														children: group.items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: item.id,
															children: item.name
														}, item.id))
													}, group.label))
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
													className: "ec-help",
													children: "本机、容器、远程与云端环境均可作为约束。"
												})
											]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ec-field",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
													className: "ec-label",
													htmlFor: "ec-workflow",
													children: "工作流"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
													id: "ec-workflow",
													className: "ec-select",
													"aria-label": "工作流",
													value: workflow,
													onChange: (event) => setWorkflow(event.target.value),
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "go",
														children: "Go：生成并验证应用"
													}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "plan",
														children: "Plan：只完善规划"
													})]
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
													className: "ec-help",
													children: "Plan 不写应用代码；Go 会继续落地实现。"
												})
											]
										})]
									}),
									environment === "custom" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-field",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
												className: "ec-label",
												htmlFor: "ec-environment-detail",
												children: ["自定义开发环境 ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "ec-required",
													"aria-hidden": "true",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
												id: "ec-environment-detail",
												className: "ec-input",
												"aria-label": "自定义开发环境",
												"aria-invalid": visibleError("environmentDetail") !== void 0,
												"aria-describedby": "ec-environment-detail-error",
												value: environmentDetail,
												maxLength: 300,
												onBlur: () => touch("environmentDetail"),
												onChange: (event) => setEnvironmentDetail(event.target.value),
												placeholder: "例如：内网 Linux 构建机 + 自托管 Runner",
												required: true
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "ec-field-error",
												id: "ec-environment-detail-error",
												"aria-live": "polite",
												children: visibleError("environmentDetail") ?? ""
											})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-switch-row",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ec-switch-copy",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "初始化 Git 仓库" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "创建 main 分支，不自动提交，也不会推送远端。" })]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
											checked: initializeGit,
											onChange: setInitializeGit,
											label: "初始化 Git 仓库"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: "ec-section",
								"aria-labelledby": "ec-section-design",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ec-section-head",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-section-title",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "ec-section-icon",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "palette" })
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
											id: "ec-section-design",
											children: "设计目标"
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "定义产品应有的视觉与体验感受" })] })]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "ec-section-meta",
										children: "最多 2000 字"
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ec-field",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
											className: "ec-label",
											htmlFor: "ec-design-goal",
											children: "你希望产品给人什么感受？"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
											id: "ec-design-goal",
											className: "ec-textarea",
											value: designGoal,
											maxLength: 2e3,
											onChange: (event) => setDesignGoal(event.target.value),
											placeholder: "例如：工具感强、信息密度适中、移动端优先"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "ec-help",
											children: "可以描述风格、目标用户、关键页面、响应式与无障碍要求。"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: "ec-section",
								"aria-labelledby": "ec-section-mcp",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-section-head",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ec-section-title",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "ec-section-icon",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "plug" })
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
												id: "ec-section-mcp",
												children: "MCP"
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "按需连接你已经确认的工具" })] })]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "ec-section-meta",
											children: "可选能力"
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-switch-row",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ec-switch-copy",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "启用手动 MCP 配置" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "把你确认过的服务器配置写入项目 .mcp.json。" })]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
											checked: mcpEnabled,
											onChange: (value) => {
												setMcpEnabled(value);
												setShowValidationSummary(false);
											},
											label: "启用 MCP"
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-switch-row",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ec-switch-copy",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: ["自动搜寻合适的 MCP ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "ec-wip",
												children: "WIP"
											})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "首版不联网、不安装，也不会修改你的 MCP 列表。" })]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
											checked: false,
											onChange: () => void 0,
											label: "自动搜寻 MCP，开发中",
											disabled: true
										})]
									}),
									mcpEnabled && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "ec-field",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
												className: "ec-label",
												htmlFor: "ec-mcp-json",
												children: "MCP servers JSON"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
												id: "ec-mcp-json",
												className: "ec-textarea ec-code",
												"aria-label": "MCP servers JSON",
												"aria-invalid": visibleError("mcpJson") !== void 0,
												value: mcpJson,
												onBlur: () => touch("mcpJson"),
												onChange: (event) => setMcpJson(event.target.value),
												spellCheck: false,
												"aria-describedby": "ec-mcp-help ec-mcp-error"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
												className: "ec-help",
												id: "ec-mcp-help",
												children: [
													"填写 mcpServers 对象，例如 ",
													`{ "my-server": { "command": "...", "args": [] } }`,
													"。"
												]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "ec-field-error",
												id: "ec-mcp-error",
												"aria-live": "polite",
												children: visibleError("mcpJson") ?? ""
											})
										]
									})
								]
							})
						] })
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
					className: "ec-summary",
					"aria-label": "本次创建摘要",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "ec-summary-head",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "本次创建" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "ec-summary-subtitle",
								children: "提交前可随时调整"
							})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "ec-summary-mode",
								children: mode === "simple" ? "简易" : "专业"
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "项目" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: projectName || "未命名" })] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "技术栈" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: effective.stack === "custom" ? stackDetail || "待填写" : stackName(effective.stack) })] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "环境" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: effective.environment === "custom" ? environmentDetail || "待填写" : environmentName(effective.environment) })] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "工作流" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: effective.workflow === "plan" ? "Plan" : "Go" })] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "Git" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: effective.git ? "初始化" : "不初始化" })] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "MCP" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: effective.mcp ? "手动配置" : "关闭" })] })
						] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "ec-action",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									className: "ec-button",
									type: "submit",
									disabled: submitting,
									children: [
										submitting && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "ec-spinner",
											"aria-hidden": "true"
										}),
										submitLabel,
										!submitting && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "arrow",
											size: 16
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "ec-footnote",
									children: "只写入 EasyCode 输出目录，随后在 Harness 中打开开发任务；同名目录不会被覆盖。"
								}),
								error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "ec-error",
									role: "alert",
									children: error
								}),
								result && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ec-result",
									"aria-live": "polite",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "check",
											size: 15
										}), handoffState === "sent" ? "已交给 DeepSeek" : handoffState === "failed" ? "项目已准备，等待手动继续" : "项目工作区已准备"] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "ec-path",
											children: result.outputPath
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											className: "ec-copy",
											type: "button",
											onClick: copyPath,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
												name: "copy",
												size: 14
											}), copied ? "已复制" : "复制路径"]
										})
									]
								})
							]
						})
					]
				})]
			})
		]
	});
}
const inject = [
	"slots",
	"locale",
	"workspaces",
	"sessions",
	"conversation"
];
function apply(ctx) {
	ctx.effect(ensureStyles, "easycode: styles");
	ctx.effect(() => ctx.locale.register(NS, copy), "easycode: dictionaries");
	const t = ctx.locale.bind(NS);
	const handoff = async (outputPath, prompt) => {
		const workspace = await ctx.workspaces.create({ path: outputPath });
		const sessionId = await ctx.workspaces.connectWorkspace(workspace.workspaceId);
		ctx.sessions.open(sessionId);
		const conversation = ctx.sessions.scope(sessionId)?.get("conversation");
		if (conversation === void 0) throw new Error("当前工作区没有可用的会话服务");
		await conversation.send(prompt);
	};
	ctx.slots.inject("settings.section", () => ctx.slots.register({
		name: "settings.section",
		id: "easycode",
		order: 15,
		label: () => t("nav"),
		inject: () => ({ handoff })
	}, EasyCodeWizard));
	ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
		name: "sidebar.footer.action",
		id: "easycode",
		order: -10,
		locale: NS
	}, EasyCodeLauncher));
	ctx.slots.inject("shell.overlay", () => ctx.slots.register({
		name: "shell.overlay",
		id: "easycode",
		order: 10,
		locale: NS,
		inject: () => ({ handoff })
	}, EasyCodeOverlay));
}

//#endregion
exports.apply = apply;
exports.inject = inject;
return module.exports; } });
//# sourceMappingURL=client.js.map