// noinspection JSUnusedGlobalSymbols

export type Consumer<T> = (t: T) => void;
export type BiConsumer<T1, T2> = (t1: T1, t2: T2) => void;

export type ConsumerAsync<T> = (t: T) => Promise<void>;
export type BiConsumerAsync<T1, T2> = (t1: T1, t2: T2) => Promise<void>;
