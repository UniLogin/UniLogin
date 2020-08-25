import {expect} from 'chai';
import {sleep} from '@unilogin/commons';
import {ObserverRunnerUnderTest} from './ObserverRunnerUnderTest';

describe('UNIT: ObserverRunner', () => {
  const tick = 1000;
  let observerRunner: ObserverRunnerUnderTest;

  beforeEach(() => {
    observerRunner = new ObserverRunnerUnderTest(tick);
  });

  it('finalizeAndStop waits for execute to be done with await', async () => {
    expect(observerRunner.iterator).to.eq(0);
    observerRunner.start();
    expect(observerRunner.iterator).to.eq(1);
    await observerRunner.finalizeAndStop();
    expect(observerRunner.iterator).to.eq(2);
  });

  it('finalizeAndStop waits for execute to be done without await', async () => {
    expect(observerRunner.iterator).to.eq(0);
    observerRunner.start();
    expect(observerRunner.iterator).to.eq(1);
    const stopPromise = observerRunner.finalizeAndStop();
    expect(observerRunner.iterator).to.eq(1);
    await stopPromise;
    expect(observerRunner.iterator).to.eq(2);
  });

  it('after waiting for finalizeAndStop iterator won`t increase', async () => {
    expect(observerRunner.iterator).to.eq(0);
    observerRunner.start();
    expect(observerRunner.iterator).to.eq(1);
    observerRunner.finalizeAndStop();
    expect(observerRunner.iterator).to.eq(1);
    await sleep(tick);
    expect(observerRunner.iterator).to.eq(2);
    await sleep(tick);
    expect(observerRunner.iterator).to.eq(2);
  });

  it('works for multiple loops', async () => {
    expect(observerRunner.iterator).to.eq(0);
    observerRunner.start();
    expect(observerRunner.iterator).to.eq(1);
    await sleep(tick);
    expect(observerRunner.iterator).to.eq(2);
    await sleep(tick);
    expect(observerRunner.iterator).to.eq(3);
    const stopPromise = observerRunner.finalizeAndStop();
    expect(observerRunner.iterator).to.eq(3);
    await stopPromise;
    expect(observerRunner.iterator).to.eq(4);
  });

  it('double stop', async () => {
    expect(observerRunner.iterator).to.eq(0);
    observerRunner.start();
    expect(observerRunner.iterator).to.eq(1);
    await observerRunner.finalizeAndStop();
    expect(observerRunner.iterator).to.eq(2);
    await sleep(tick);
    expect(observerRunner.iterator).to.eq(2);
    await observerRunner.finalizeAndStop();
    expect(observerRunner.iterator).to.eq(2);
    expect(observerRunner.isStopped()).to.be.true;
  });

  it('finalize after stop', async () => {
    expect(observerRunner.iterator).to.eq(0);
    observerRunner.start();
    expect(observerRunner.iterator).to.eq(1);
    observerRunner.stop();
    expect(observerRunner.iterator).to.eq(1);
    await observerRunner.finalizeAndStop();
    expect(observerRunner.iterator).to.eq(2);
    expect(observerRunner.isStopped()).to.be.true;
  });
});
