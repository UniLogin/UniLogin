export const setupSdkTicks = (sdk: any) => {
  sdk.executionFactory.tick = 10;
  sdk.authorisationsObserver.step = 10;
};
