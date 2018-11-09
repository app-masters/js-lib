import Plural, {pluralize, config} from '../src/plural';

describe('Importing the class', () => {
    it('Accepts a config Object', () => {
        expect(Plural.config({
            'reunião': 'reuniões',
            'amor': 'amores'
        })).toBeTruthy();
    });

    it('Pluralizes a normal word', () => {
        const contatos = Plural.pluralize('contato', 3);
        expect(contatos).toEqual('contatos');
    })

    it('Mantains first uppercase letter', () => {
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
        const reunioes = Plural.pluralize('reunião', 5);
        expect(reunioes).toEqual('reuniões');
    })
})