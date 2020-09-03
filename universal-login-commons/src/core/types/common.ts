export type Procedure = (...args: any[]) => void;

export type Predicate = (...args: any[]) => boolean;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type PartialRequired<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

export type DeepPartial<T> = {[P in keyof T]?: DeepPartial<T[P]>};

export type Nullable<T> = T | null;

export type Choose<T, K> = T extends { kind: K } ? T : never;
