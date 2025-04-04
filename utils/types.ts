export type Nullable<T> = T extends object
  ? { [P in keyof T]: Nullable<T[P]> }
  : T | null;

export type OptionalNullable<T> = Partial<Nullable<T>>;
