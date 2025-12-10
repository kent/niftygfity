declare module "@rails/actioncable" {
  export interface Subscription {
    unsubscribe(): void;
    perform(action: string, data?: Record<string, unknown>): void;
  }

  export interface Subscriptions {
    create(
      channel: string | { channel: string; [key: string]: unknown },
      callbacks?: {
        connected?: () => void;
        disconnected?: () => void;
        received?: (data: unknown) => void;
        rejected?: () => void;
      }
    ): Subscription;
  }

  export interface Consumer {
    subscriptions: Subscriptions;
    disconnect(): void;
  }

  export function createConsumer(url?: string): Consumer;
}
