export type Procedure = (...args: any[]) => void;

export type Predicate = (...args: any[]) => boolean;

export type Partial<T> = {[P in keyof T]?: T[P]; };
