type State<T> = {
  kind: 'Uninitialized';
} | {
  kind: 'Loading';
  promise: Promise<T>;
} | {
  kind: 'Loaded';
  value: T;
};

export class Lazy<T> {
  private state: State<T> = {kind: 'Uninitialized'};

  constructor(
    private readonly loadValue: () => Promise<T>,
  ) {}

  async load() {
    switch (this.state.kind) {
      case 'Uninitialized':
        const promise = this.loadValue();
        this.state = {kind: 'Loading', promise};
        const value = await promise;
        this.state = {kind: 'Loaded', value};
        return value;
      case 'Loading':
        return this.state.promise;
      case 'Loaded':
        return this.state.value;
    }
  }

  get() {
    if (this.state.kind !== 'Loaded') throw new TypeError('Value is not loaded');
    return this.state.value;
  }
}
