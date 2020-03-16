type State<T, B> = {
  kind: 'None';
} | {
  kind: 'Initializing';
  value: Promise<T>;
} | {
  kind: 'Initialized';
  value: Promise<T>;
} | {
  kind: 'Finalizing';
  value: Promise<B>;
} | {
  kind: 'Finalized';
  value: Promise<B>;
};

export class InitializationHandler<T, B> {
  private state: State<T, B> = {kind: 'None'};

  constructor(
    private _initialize: () => Promise<T>,
    private _finalize: () => Promise<B>,
  ) {}

  async initialize(): Promise<T> {
    if (this.state.kind === 'Finalizing') {
      throw Error('Cannot initialize during finalizing');
    }
    if (this.state.kind === 'Finalized' || this.state.kind === 'None') {
      const value = this._initialize();
      this.state = {
        kind: 'Initializing',
        value,
      };
      await value;
      this.state = {kind: 'Initialized', value};
    }
    return this.state.value;
  }

  async finalize(): Promise<B | undefined> {
    if (this.state.kind === 'None') {
      return;
    }
    if (this.state.kind === 'Initializing') {
      throw Error('Cannot finalize during initializing');
    }
    if (this.state.kind === 'Initialized') {
      const value = this._finalize();
      this.state = {kind: 'Finalizing', value};
      await value;
      this.state = {kind: 'Finalized', value};
    }
    return this.state.value;
  }
}
