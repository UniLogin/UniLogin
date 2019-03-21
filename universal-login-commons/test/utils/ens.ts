import {expect} from 'chai';
import {parseDomain} from '../../lib/utils/ens';

describe('parseDomain', () => {
    it('simple', () => {
        expect(parseDomain('alex.mylogin.eth'))
            .to.deep.eq(['alex', 'mylogin.eth']);
        expect(parseDomain('john.mylogin.eth'))
            .to.deep.eq(['john', 'mylogin.eth']);
        expect(parseDomain('marek.universal-id.eth'))
            .to.deep.eq(['marek', 'universal-id.eth']);
    });

    it('complex label', () => {
        expect(parseDomain('john.and.marek.universal-id.eth'))
            .to.deep.eq(['john', 'and.marek.universal-id.eth']);
    });

    it('empty label', () => {
        expect(parseDomain('universal-id.eth'))
            .to.deep.eq(['universal-id', 'eth']);
    });
});