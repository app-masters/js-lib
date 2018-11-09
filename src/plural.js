class Plural {
    static config(specialCases) {
        this.specialCases = specialCases;
        return this.specialCases;
    }
    static pluralize(word, value) {
        const isFirstLetterUpperCase = word.match(/^[A-Z]/);
        word = word.toLowerCase();
        let singular = word;
        let plural = word + 's';
        if(this.specialCases[word]) {
            plural = this.specialCases[word]
        }
        if(isFirstLetterUpperCase) plural = plural.replace(/^([a-z])/, (p1) => p1.toUpperCase())
        if(value > 1) return plural;
        return singular;
    }
}

export default Plural;
export const pluralize = Plural.pluralize;
export const config = Plural.config;