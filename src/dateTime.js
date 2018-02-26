import moment from 'moment';

moment.updateLocale('pt-br', require('moment/locale/pt-br'));

class DateTime {

    /**
     * DONT USE IT!!! NEED MORE TESTS!!!
     * Show a pretty date format
     * @param date
     * @param unique
     * @returns {*}
     */
    static humanize(date, unique) {

        if (!date)
            return null;

        let now = new Date();
        let timeDiff = now - new Date(date);

        timeDiff /= 1000;

        let days = Math.floor(timeDiff / 86400);
        let hours = Math.floor((timeDiff - (days * 86400 )) / 3600);
        let minutes = Math.floor((timeDiff - (days * 86400 ) - (hours * 3600 )) / 60);
        let secs = Math.floor((timeDiff - (days * 86400 ) - (hours * 3600 ) - (minutes * 60)));

        let result = '';
        if (unique === false) {
            result = [];
            if (days === 1)
                result.push("1 dia");
            if (days > 1)
                result.push(days + " dias");
            if (hours > 0)
                result.push(hours + " horas");
            if (minutes > 0)
                result.push(minutes + " minutos");
            if (secs > 0)
                result.push(secs + " segundos");
            result = result.join(", ");
        } else {
            if (days === 1)
                result = "1 dia";
            else if (days > 1)
                result = days + " dias";
            else if (hours > 0)
                result += hours + " horas";
            else if (minutes > 0)
                result += minutes + " minutos";
            else if (secs > 0)
                result += secs + " segundos";
            else
                result = "agora";
        }
        // let x = "(" + days + " Days " + hours + " Hours " + minutes + " Minutes and " + secs + " Secondes " + ")";

        return result;
    }

    static relative(date, showHour, shortenMonth, defaultMask) {
        if (!date)
            return null;
        date = new Date(date);

        let now = new Date(Date.now());
        let timeDiff = now - date;

        timeDiff /= 1000;

        let sameYear = date.getYear() === now.getYear();
        let sameMonth = sameYear && date.getMonth() === now.getMonth();
        let sameDay = sameMonth && date.getDate() === now.getDate();

        let days = sameDay ? 0 : -Math.floor(timeDiff / 86400);
        let hours = Math.floor((timeDiff - (days * 86400 )) / 3600);
        let minutes = Math.floor((timeDiff - (days * 86400 ) - (hours * 3600 )) / 60);
        let secs = Math.floor((timeDiff - (days * 86400 ) - (hours * 3600 ) - (minutes * 60)));


        let hour = (showHour ? ' às ' + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) : '');

        // console.log("days", days);
        // console.log("hours", hours);
        // console.log("minutes", minutes);
        // console.log("secs", secs);

        if (days === 0) {
            return 'Hoje' + hour;
        } else if (days === 1) {
            return 'Amanhã' + hour;
        } else if (days === -1) {
            return 'Ontem' + hour;
        } else if (sameMonth) {
            return "Dia " + ("0" + date.getDate()).slice(-2) + hour;
        } else if (sameYear) {
            return ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + hour;
        } else if (!sameYear) {
            return ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear() + hour;
        } else {
            console.log("days", days);
            console.log("hours", hours);
            console.log("minutes", minutes);
            console.log("secs", secs);
        }
    }

    static _sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    /**
     * Return a formated hour "hh:mm:ss" from a seconds number
     * @param seconds
     */
    static secondsToHour(seconds, round) {
        if (seconds === undefined || seconds === null) return null;
        // console.log("seconds", seconds);
        let duration = moment.duration(seconds, 'seconds');
        round = false;
        if (round)
            return Math.round(duration.asHours()) + " hs";
        else
            return Math.floor(duration.asHours()) + ":" + ("0" + duration.minutes()).slice(-2);
    }

    /**
     * Return a humanize hour like "1 dia" from a seconds number
     * @param seconds
     */
    static secondsToHumanize(seconds) {
        if (seconds === undefined || seconds === null) return null;
        // console.log("seconds", seconds);
        let duration = moment.duration(seconds, 'seconds');
        // console.log("duration", duration);
        let formatted = duration.humanize();
        return formatted;
    }

    static formatHour(value) {
        return moment(value).format('hh:mm');
        // return hora;
    }

    static _addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    static formatDateTime(date, space) {
        if (!date) return null;
        let result = '';
        result = DateTime.TSToDate(date) + space + DateTime.formatHour(date);
        // console.log(result);
        return result;
    }

// Função que recebe data DD-MM-YYYY e devolve YYYY-MM-DD
    static DateToISO(dateStr) {
        if (dateStr !== '') {
            return dateStr.split('/').reverse().join('/');
        } else {
            return '';
        }
    }

// Função que recebe data DD-MM-YYYY e devolve UNIX TimeStamp
    static DateToTS(dateStr) {
        if (dateStr !== '') {
            const ISODate = DateTime.DateToISO(dateStr);
            const TSDate = (new Date(ISODate));

            return TSDate;
        } else {
            return '';
        }
    }

// Função que recebe UNIX TimeStamp e devolve data DD-MM-YYYY
    static TSToDate(TSValue) {
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
    static freqToTS(freqValue, daily) {
        if (daily) {
            return freqValue * 3600; // 60 minutos * 60 segundos
        } else {
            return freqValue * 86400; // 24 horas * 60 minutos * 60 segundos
        }
    }

// Função que recebe data HH:MM e devolve UNIX TimeStamp
    static TimeToTS(TimeStr) {
        if (TimeStr !== '') {
            const timeVec = TimeStr.split(':');
            return (timeVec[0] * 3600 + timeVec[1] * 60);
        } else {
            return '';
        }
    }

    static TSToTime(TSValue) {
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

    static RelativeDate(TimeStr) {
        const dueDate = moment(TimeStr, 'DD-MM-YYYY');
        if (dueDate.diff(moment(), 'days') <= 6) {
            const date = dueDate.calendar().split(' às')[0];
            return (date + ', ' + moment(TimeStr, 'DD-MM-YYYY').format('LL'));
        } else {
            return (moment(TimeStr, 'DD-MM-YYYY').format('LL'));
        }
    }

    static TSToFreqString(TimeStr) {
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
