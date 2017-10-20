import moment from 'moment';

moment.updateLocale('pt-br', require('moment/locale/pt-br'));

class DateTime {
    /**
     * Return a formated hour "hh:mm:ss" from a seconds number
     * @param seconds
     */
    static secondsToHour (seconds, round) {
        if (!seconds) return null;
        console.log("seconds", seconds);
        let duration = moment.duration(seconds, 'seconds');
        let formatted = duration.asHours();
        // if (round)
        formatted = Math.round(formatted) + " horas";
        console.log("formatted", formatted);
        return formatted;
    }

    /**
     * Return a humanize hour like "1 dia" from a seconds number
     * @param seconds
     */
    static secondsToHumanize (seconds) {
        if (!seconds) return null;
        // console.log("seconds", seconds);
        let duration = moment.duration(seconds, 'seconds');
        // console.log("duration", duration);
        let formatted = duration.humanize();
        return formatted;
    }

    static formatHour (value) {
        return moment(value).format('hh:mm');
        // return hora;
    }

    static _addZero (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    static formatDateTime (date, space) {
        if (!date) return null;
        let result = '';
        result = DateTime.TSToDate(date) + space + DateTime.formatHour(date);
        // console.log(result);
        return result;
    }

// Função que recebe data DD-MM-YYYY e devolve YYYY-MM-DD
    static DateToISO (dateStr) {
        if (dateStr !== '') {
            return dateStr.split('/').reverse().join('/');
        } else {
            return '';
        }
    }

// Função que recebe data DD-MM-YYYY e devolve UNIX TimeStamp
    static DateToTS (dateStr) {
        if (dateStr !== '') {
            const ISODate = DateTime.DateToISO(dateStr);
            const TSDate = (new Date(ISODate));

            return TSDate;
        } else {
            return '';
        }
    }

// Função que recebe UNIX TimeStamp e devolve data DD-MM-YYYY
    static TSToDate (TSValue) {
        if (TSValue !== '') {
            const fullDate = (new Date(TSValue));
            return (
                fullDate.getUTCDate() + '/' +
                (fullDate.getUTCMonth() + 1) + '/' +
                fullDate.getUTCFullYear()
            );
        } else {
            return '';
        }
    }

// Função que recebe frequencia e converte para intervalo de TimeStamp
    static freqToTS (freqValue, daily) {
        if (daily) {
            return freqValue * 3600; // 60 minutos * 60 segundos
        } else {
            return freqValue * 86400; // 24 horas * 60 minutos * 60 segundos
        }
    }

// Função que recebe data HH:MM e devolve UNIX TimeStamp
    static TimeToTS (TimeStr) {
        if (TimeStr !== '') {
            const timeVec = TimeStr.split(':');
            return (timeVec[0] * 3600 + timeVec[1] * 60);
        } else {
            return '';
        }
    }

    static TSToTime (TSValue) {
        if (TSValue !== '') {
            let minutes = Math.floor((TSValue % 3600) / 60);
            let hours = Math.floor(TSValue / 3600);
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return (hours + ':' + minutes);
        } else {
            return '';
        }
    }

    static RelativeDate (TimeStr) {
        const dueDate = moment(TimeStr, 'DD-MM-YYYY');
        if (dueDate.diff(moment(), 'days') <= 6) {
            const date = dueDate.calendar().split(' às')[0];
            return (date + ', ' + moment(TimeStr, 'DD-MM-YYYY').format('LL'));
        } else {
            return (moment(TimeStr, 'DD-MM-YYYY').format('LL'));
        }
    }

    static TSToFreqString (TimeStr) {
        if (TimeStr <= 86400) {
            return 'Diário';
        } else if (TimeStr === 604800) {
            return 'Semanal';
        } else if (TimeStr === 1296000) {
            return 'Quinzenal';
        } else if (TimeStr === 2592000) {
            return 'Mensal';
        } else {
            return null;
        }
    }
}

export default DateTime;
