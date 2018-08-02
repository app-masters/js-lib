class Text {
    static shorten (text, maxLength, options) {
        if (text === undefined || text == null || text.length <= maxLength) {
            return text;
        }
        if (!options) {
            options = {
                suffix: true,
                suffixString: ' ...',
                // By default we preserve word boundaries
                preserveWordBoundaries: true,
                wordSeparator: ' '
            };
        }
        // Compute suffix to use (eventually add an ellipsis)
        var suffix = '';
        if (text.length > maxLength && options.suffix) {
            suffix = options.suffixString;
        }

        // Compute the index at which we have to cut the text
        var maxTextLength = maxLength - suffix.length;
        var cutIndex;
        if (options.preserveWordBoundaries) {
            // We use +1 because the extra char is either a space or will be cut anyway
            // This permits to avoid removing an extra word when there's a space at the maxTextLength index
            var lastWordSeparatorIndex = text.lastIndexOf(options.wordSeparator, maxTextLength + 1);
            // We include 0 because if have a "very long first word" (size > maxLength), we still don't want to cut it
            // But just display "...". But in this case the user should probably use preserveWordBoundaries:false...
            cutIndex = lastWordSeparatorIndex > 0 ? lastWordSeparatorIndex : maxTextLength;
        } else {
            cutIndex = maxTextLength;
        }

        var newText = text.substr(0, cutIndex);
        return newText + suffix;
    }

    static validateEmail (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    static ucWords (str) {
        str = str.trim();
        str = str.toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function (letter) {
            return letter.toUpperCase();
        });
        return str;
    }

    /// Name utils methos

    /**
     * Return the name and surname
     * "Tiago Gouvêa de Oliveira" will return "Tiago Gouvea"
     * @author TiagoGouvea
     * @param name
     * @returns String
     */
    static nameSurname (name) {
        name = Text.ucWords(name);
        if (!name) return '';
        return Text.firstName(name) + ' ' + Text.surName(name);
    }

    /**
     * Return the person firt name
     * @author TiagoGouvea
     * @returns String
     * @param name
     */
    static firstName (name) {
        name = Text.ucWords(name);
        if (!name) return '';
        let names = name.split(' ');
        if (names.length === 1) {
            return name;
        } else {
            return names[0];
        }
    }

    /**
     * Return the person sur name
     * @author TiagoGouvea
     * @returns String
     * @param name
     */
    static surName (name) {
        name = Text.ucWords(name);
        if (!name) return '';
        let names = name.trim().split(' ');
        let sur = '';
        if (names.length >= 2) {
            sur = names[1];
        }
        if (names.length >= 3 && (['de', 'da', 'do', 'dos', 'das', 'del', 'dal', 'das']).indexOf(sur.toLowerCase()) > -1) {
            sur = names[1] + ' ' + names[2];
        }
        return sur;
    }

    // private function iniciais()
    // {
    //     $nomes = explode(" ", mb_convert_case(mb_strtolower($this->nome), MB_CASE_TITLE, "UTF-8"));
    //     if (count($nomes) >= 2) {
    //         $return = '';
    //         foreach ($nomes as $nome) {
    //             $return .= substr($nome, 0, 1);
    //         }
    //         return $return;
    //     } else
    //         return substr($this->nome, 0, 1);
    // }

    static phoneMask (phone) {
        phone = phone.replace(/\D/g, '');
        phone = phone.replace(/^(\d{2})(\d)/g, '($1) $2');
        phone = phone.replace(/(\d)(\d{4})$/, '$1-$2');
        return phone;
    };

    // Format phone to (XX)XXXXX-XXXX or X...X-XXXX
    static formatPhone (v) {
        v = v.replace(/\D/g, '');
        if (v.length > 9) {
            v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
            v = v.replace(/(\d)(\d{4})$/, '$1-$2');
        } else if (v.length > 4) {
            v = v.replace(/(\d)(\d{4})$/, '$1-$2');
        }
        return v;
    }

    static sortByKey (objArray, key) {
        return objArray.sort((item, lastItem) => {
            const name = this.replaceSpecial(item[key].toUpperCase());
            const last = this.replaceSpecial(lastItem[key].toUpperCase());
            if (name < last) {
                return -1;
            } else if (name > last) {
                return 1;
            } else {
                return 0;
            }
        });
    };

    static slugify (str, replaceObj) {
        // Optional parameter to replace defined characters: {'#': 'sharp', '.': 'dot'}
        if (replaceObj) {
            Object.keys(replaceObj).map(key => {
                if (str.indexOf(key) > -1) {
                    str = str.split(key).join(replaceObj[key]);
                }
            });
        }
        return (str && str.trim()) ? Text.replaceSpecial(str)
        .toLowerCase()
        .replace('.', '')
        .replace(/\s+/g, '-')
        .replace(/\-\-+/g, '-')
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '') : '';
    }

    static replaceSpecial (str) {
        let conversions = {};
        conversions['ae'] = 'ä|æ|ǽ';
        conversions['oe'] = 'ö|œ';
        conversions['ue'] = 'ü';
        conversions['Ae'] = 'Ä';
        conversions['Ue'] = 'Ü';
        conversions['Oe'] = 'Ö';
        conversions['A'] = 'À|Á|Â|Ã|Ä|Å|Ǻ|Ā|Ă|Ą|Ǎ';
        conversions['a'] = 'à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª';
        conversions['C'] = 'Ç|Ć|Ĉ|Ċ|Č';
        conversions['c'] = 'ç|ć|ĉ|ċ|č';
        conversions['D'] = 'Ð|Ď|Đ';
        conversions['d'] = 'ð|ď|đ';
        conversions['E'] = 'È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě';
        conversions['e'] = 'è|é|ê|ë|ē|ĕ|ė|ę|ě';
        conversions['G'] = 'Ĝ|Ğ|Ġ|Ģ';
        conversions['g'] = 'ĝ|ğ|ġ|ģ';
        conversions['H'] = 'Ĥ|Ħ';
        conversions['h'] = 'ĥ|ħ';
        conversions['I'] = 'Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ';
        conversions['i'] = 'ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı';
        conversions['J'] = 'Ĵ';
        conversions['j'] = 'ĵ';
        conversions['K'] = 'Ķ';
        conversions['k'] = 'ķ';
        conversions['L'] = 'Ĺ|Ļ|Ľ|Ŀ|Ł';
        conversions['l'] = 'ĺ|ļ|ľ|ŀ|ł';
        conversions['N'] = 'Ñ|Ń|Ņ|Ň';
        conversions['n'] = 'ñ|ń|ņ|ň|ŉ';
        conversions['O'] = 'Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ';
        conversions['o'] = 'ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º';
        conversions['R'] = 'Ŕ|Ŗ|Ř';
        conversions['r'] = 'ŕ|ŗ|ř';
        conversions['S'] = 'Ś|Ŝ|Ş|Š';
        conversions['s'] = 'ś|ŝ|ş|š|ſ';
        conversions['T'] = 'Ţ|Ť|Ŧ';
        conversions['t'] = 'ţ|ť|ŧ';
        conversions['U'] = 'Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ';
        conversions['u'] = 'ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ';
        conversions['Y'] = 'Ý|Ÿ|Ŷ';
        conversions['y'] = 'ý|ÿ|ŷ';
        conversions['W'] = 'Ŵ';
        conversions['w'] = 'ŵ';
        conversions['Z'] = 'Ź|Ż|Ž';
        conversions['z'] = 'ź|ż|ž';
        conversions['AE'] = 'Æ|Ǽ';
        conversions['ss'] = 'ß';
        conversions['IJ'] = 'Ĳ';
        conversions['ij'] = 'ĳ';
        conversions['OE'] = 'Œ';
        conversions['f'] = 'ƒ';

        for (let i in conversions) {
            let re = new RegExp(conversions[i], 'g');
            str = str.replace(re, i);
        }
        return str;
    };

    /**
     * Based on the amount, decides to use the singular or plural word passed in as arguments.
     * @static
     * @param {Number} amount
     * @param {String} singularWord
     * @param {String} pluralWord
     * @param {boolean} [zeroUsesSingular=false]
     * @memberof Text
     * @author Max William
     */
    static singularOrPlural (amount, singularWord, pluralWord, zeroUsesSingular = false) {
        if (amount === 0) {
            return (zeroUsesSingular) ? singularWord : pluralWord;
        } else if (amount === 1) {
            return singularWord;
        } else {
            return pluralWord;
        }
    }

    /**
     *
     * @param {*} n valor de entrada
     * @param {*} prefix prefixo (R$)
     * @param {*} sufix sufixo (%)
     * @param {*} c casas decimais
     * @param {*} d pelo o que vai subistutir
     * @param {*} t o que vai substituir
     */
    static formatNumber (n, prefix = '', sufix = '', c = 2, d = ',', t = '.') {
        c = isNaN(c = Math.abs(c)) ? 2 : c;
        d = d === undefined ? '.' : d;
        t = t === undefined ? ',' : t;
        let s = n < 0 ? '-' : '';
        let i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
        let j = (j = i.length) > 3 ? j % 3 : 0;
        return prefix + (s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '')) + sufix;
    };

    static formatReal (number, decimals = 2) {
        return Text.formatNumber(number, 'R$', '', decimals);
    }

}

export default Text;
