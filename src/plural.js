const Plural = (function () {
    let specialCases = {}
    function config(cases) {
        specialCases = cases;
        return specialCases;
    }
    function pluralize(word, value) {
        const isFirstLetterUpperCase = word.match(/^[A-Z]/);
        word = word.toLowerCase();
        let singular = word;
        let plural = word + 's';
        if(specialCases[word]) {
            plural = specialCases[word]
        }
        if(isFirstLetterUpperCase) plural = plural.replace(/^([a-z])/, (p1) => p1.toUpperCase())
        if(value > 1) return plural;
        return singular;
    }
    return {config, pluralize}
})()

export default Plural;
export const pluralize = Plural.pluralize;
export const config = Plural.config;