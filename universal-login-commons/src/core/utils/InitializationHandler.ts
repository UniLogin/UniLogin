type State<T, B> = {
  kind: 'None';
} | {
  kind: 'Initializing';
  promise: Promise<T>;
} | {
  kind: 'Initialized';
  value: T;
} | {
  kind: 'Finalizing';
  promise: Promise<B>;
} | {
  kind: 'Finalized';
  value: B;
};

export class InitializationHandler<T, B> {
  private state: State<T, B> = {kind: 'None'};

  constructor(
    private _initialize: () => Promise<T>,
    private _finalize: () => Promise<B>,
  ) {}

  async initialize(): Promise<T> {
    switch (this.state.kind) {
      case 'Finalizing':
        throw Error('Cannot initialize during finalizing');
      case 'Initializing':
        return this.state.promise;
      case 'Initialized':
        return this.state.value;
      case 'None':
      case 'Finalized':
        const promise = this._initialize();
        this.state = {kind: 'Initializing', promise};
        const value = await promise;
        this.state = {kind: 'Initialized', value};
        return value;
    }
  }

  async finalize(): Promise<B | undefined> {
    switch (this.state.kind) {
      case 'None':
        return;
      case 'Initializing':
        throw Error('Cannot finalize during initializing');
      case 'Finalizing':
        return this.state.promise;
      case 'Finalized':
        return this.state.value;
      case 'Initialized':
        const promise = this._finalize();
        this.state = {kind: 'Finalizing', promise};
        const value = await promise;
        this.state = {kind: 'Finalized', value};
        return value;
    }
  }
};
