import {expect} from 'chai';
import ModalService from '../../../src/ui/ModalService';

describe('ModalService', () => {
  it('notifies subscribers', () => {
    const service = new ModalService();
    const events: string[] = [];
    const unsubscribe = service.subscribe(event => events.push(event));

    service.showModal('invitation');
    service.showModal('request');

    service.hideModal();

    unsubscribe();
    expect(events).to.deep.equal([
      'invitation',
      'request',
      'none'
    ]);
  });

  it('does not notify after subscription', () => {
    const service = new ModalService();
    const events: string[] = [];
    const unsubscribe = service.subscribe(event => events.push(event));

    service.showModal('invitation');
    unsubscribe();
    service.showModal('transfer');

    expect(events).to.deep.equal(['invitation']);
  });
});
