import { IncomingMessage, ServerResponse } from "node:http";

//#region src/types.d.ts
declare const APP_MODES: readonly ["simple", "professional"];
declare const APP_STACKS: readonly ["auto", "vanilla", "react-vite", "vue-vite", "svelte-vite", "solid-vite", "angular", "astro", "qwik", "nextjs", "nuxt", "remix", "sveltekit", "tanstack-start", "node-api", "express", "fastify", "nestjs", "hono", "bun-api", "deno-api", "python-fastapi", "python-django", "go-api", "rust-axum", "java-spring", "kotlin-ktor", "dotnet-api", "php-laravel", "ruby-rails", "electron", "tauri", "react-native", "expo", "flutter", "browser-extension", "custom"];
declare const DEV_ENVIRONMENTS: readonly ["auto", "local", "docker", "podman", "devcontainer", "wsl", "nix", "remote-ssh", "codespaces", "kubernetes", "custom"];
declare const WORKFLOWS: readonly ["plan", "go"];
type AppMode = (typeof APP_MODES)[number];
type AppStack = (typeof APP_STACKS)[number];
type DevEnvironment = (typeof DEV_ENVIRONMENTS)[number];
type WorkflowMode = (typeof WORKFLOWS)[number];
interface McpServerConfig {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
}
interface EasyCodeRequest {
  mode: AppMode;
  projectName: string;
  topic: string;
  stack: AppStack;
  stackDetail: string;
  environment: DevEnvironment;
  environmentDetail: string;
  initializeGit: boolean;
  workflow: WorkflowMode;
  designGoal: string;
  mcpEnabled: boolean;
  mcpServers: Record<string, McpServerConfig>;
}
interface EasyCodeResult {
  ok: true;
  projectName: string;
  outputPath: string;
  workflow: WorkflowMode;
  files: string[];
  gitInitialized: boolean;
}
//#endregion
//#region src/scaffolder.d.ts
declare function generateProject(outputRoot: string, config: EasyCodeRequest): Promise<EasyCodeResult>;
//#endregion
//#region src/templates.d.ts
type ProjectFiles = Map<string, string>;
declare function buildProjectFiles(config: EasyCodeRequest): ProjectFiles;
//#endregion
//#region src/validation.d.ts
declare function parseEasyCodeRequest(value: unknown): EasyCodeRequest;
//#endregion
//#region src/index.d.ts
interface Config {
  /** Absolute or process-relative directory that contains generated projects. */
  outputRoot?: string;
}
interface WebServerLike {
  register(route: {
    kind: 'exact' | 'prefix';
    path: string;
    handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
  }): () => void;
}
interface ContextLike {
  webServer: WebServerLike;
  effect<T>(factory: () => T, label?: string): T;
}
declare const name = "easycode";
declare const inject: string[];
/** Register EasyCode's same-origin project creation endpoint. */
declare function apply(ctx: ContextLike, config?: Config): void;
//#endregion
export { Config, type EasyCodeRequest, type EasyCodeResult, apply, buildProjectFiles, generateProject, inject, name, parseEasyCodeRequest };
//# sourceMappingURL=index.d.ts.map