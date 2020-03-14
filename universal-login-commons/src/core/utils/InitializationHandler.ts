type State<T, B> = {
  kind: 'None';
} | {
  kind: 'Initializing';
  value: T | Promise<T>;
} | {
  kind: 'Initialized';
  value: T | Promise<T>;
} | {
  kind: 'Finalizing';
  value: B | Promise<B>;
} | {
  kind: 'Finalized';
  value: B | Promise<B>;
};

export class InitializationHandler<T, B> {
  private state: State<T, B> = {kind: 'None'};

  constructor(
    private _initialize: () => (T | Promise<T>),
    private _finalize: () => B | Promise<B>,
  ) {}

  initialize(): T | Promise<T> {
    if (this.state.kind === 'Finalizing') {
      throw Error('Cannot initialize during finalizing');
    }
    if (this.state.kind === 'Finalized' || this.state.kind === 'None') {
      const value = this._initialize();
      if (isPromise(value)) {
        this.state = {
          kind: 'Initializing',
          value,
        };
        (this.state.value as Promise<T>).then(() => {
          this.state = {kind: 'Initialized', value};
        });
      } else {
        this.state = {kind: 'Initialized', value};
      }
    }
    return this.state.value;
  }

  finalize(): B | Promise<B> | undefined {
    if (this.state.kind === 'None') {
      return;
    }
    if (this.state.kind === 'Initializing') {
      throw Error('Cannot finalize during initializing');
    }
    if (this.state.kind === 'Initialized') {
      const value = this._finalize();
      if (isPromise(value)) {
        this.state = {kind: 'Finalizing', value};
        (value as Promise<B>).then(() => {
          this.state = {kind: 'Finalized', value};
        });
      } else {
        this.state = {kind: 'Finalized', value};
      }
    }
    return this.state.value;
  }
}

const isPromise = (value: unknown) => value && !!(value as any).then;
