declare module '@deepseek-ai/dsh-client-runtime/client' {
  export interface ClientContext {
    effect<T>(factory: () => T, label?: string): T
    locale: {
      register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void
      bind(namespace: string): (key: string) => string
    }
    slots: {
      inject(name: string, factory: () => unknown): void
      register(options: Record<string, unknown>, component: unknown): () => void
    }
    workspaces: {
      create(input: { path: string }): Promise<{ workspaceId: string }>
      connectWorkspace(workspaceId: string): Promise<string>
    }
    sessions: {
      open(sessionId: string): void
      scope(sessionId: string): { get(name: 'conversation'): { send(text: string): Promise<void> } | undefined } | undefined
    }
  }
}

declare module '@deepseek-ai/dsh-client-ui-settings/client' {}

declare module '@deepseek-ai/dsh-client-ui-sidebar/client' {}

declare module '@deepseek-ai/dsh-client-ui-layout/client' {}

declare module '@deepseek-ai/dsh-client-ui-conversation/client' {}

declare module '@deepseek-ai/dsh-client-locale/client' {}
