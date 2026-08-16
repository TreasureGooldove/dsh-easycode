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
  }
}

declare module '@deepseek-ai/dsh-client-ui-settings/client' {}

declare module '@deepseek-ai/dsh-client-locale/client' {}
