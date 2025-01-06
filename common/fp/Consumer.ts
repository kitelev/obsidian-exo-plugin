export type Consumer<T> = (t: T) => void;

export type ConsumerAsync<T> = (t: T) => Promise<void>;
