export const setupSdkTicks = (sdk: any) => {
  sdk.executionFactory.tick = 10;
  sdk.authorisationsObserver.tick = 10;
};
