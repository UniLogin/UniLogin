type State<T, B> = {
  kind: 'Initialized';
  value: T;
} | {
  kind: 'Finalized';
  value: B | undefined;
};

export class InitializationHandler<T, B> {
  private state: State<T, B> = {
    kind: 'Finalized',
    value: undefined,
  };

  constructor(
    private _initialize: () => T,
    private _finalize: () => B,
  ) {}

  initialize(): T {
    if (this.state.kind !== 'Initialized') {
      this.state = {
        kind: 'Initialized',
        value: this._initialize(),
      };
    }
    return this.state.value;
  }

  finalize(): B | undefined {
    if (this.state.kind !== 'Finalized') {
      this.state = {
        kind: 'Finalized',
        value: this._finalize(),
      };
    }
    return this.state.value;
  }
}
