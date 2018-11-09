import Plural, {pluralize, config} from '../dist/plural';

describe('Importing the class', () => {
    it('Accepts a config Object', () => {
        expect(typeof Plural.config({
            'reunião': 'reuniões',
            'amor': 'amores'
        })).toBe('object');
    });

    it('Pluralizes a normal word', () => {
        const contatos = Plural.pluralize('contato', 3);
        expect(contatos).toEqual('contatos');
    })

    it('Mantains first letter as uppercase', () => {
        const reunioes = Plural.pluralize('Reunião', 5);
        expect(reunioes).toEqual('Reuniões');
    })

    it('Pluralizes a special word properly', () => {
        const reunioes = Plural.pluralize('reunião', 5);
        expect(reunioes).toEqual('reuniões');
    })
})

describe('Importing only the functions', () => {
    it('Imports pluralize correctally', () => {
        expect(pluralize).toBeTruthy();
    });
    it('Imports config correctally', () => {
        expect(config).toBeTruthy();
    });
    it('Still has access to config', () => {
        let reunioes = pluralize('reunião', 5);
        expect(reunioes).toEqual('reuniões');
        let amores = pluralize('Amor', 5);
        expect(amores).toEqual('Amores');
    })
})