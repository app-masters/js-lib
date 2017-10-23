'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_moment2.default.updateLocale('pt-br', require('moment/locale/pt-br'));

var DateTime = function () {
    function DateTime() {
        _classCallCheck(this, DateTime);
    }

    _createClass(DateTime, null, [{
        key: 'secondsToHour',

        /**
         * Return a formated hour "hh:mm:ss" from a seconds number
         * @param seconds
         */
        value: function secondsToHour(seconds, round) {
            if (!seconds) return null;
            console.log("seconds", seconds);
            var duration = _moment2.default.duration(seconds, 'seconds');
            var formatted = duration.asHours();
            // if (round)
            formatted = Math.round(formatted) + " horas";
            console.log("formatted", formatted);
            return formatted;
        }

        /**
         * Return a humanize hour like "1 dia" from a seconds number
         * @param seconds
         */

    }, {
        key: 'secondsToHumanize',
        value: function secondsToHumanize(seconds) {
            if (!seconds) return null;
            // console.log("seconds", seconds);
            var duration = _moment2.default.duration(seconds, 'seconds');
            // console.log("duration", duration);
            var formatted = duration.humanize();
            return formatted;
        }
    }, {
        key: 'formatHour',
        value: function formatHour(value) {
            return (0, _moment2.default)(value).format('hh:mm');
            // return hora;
        }
    }, {
        key: '_addZero',
        value: function _addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    }, {
        key: 'formatDateTime',
        value: function formatDateTime(date, space) {
            if (!date) return null;
            var result = '';
            result = DateTime.TSToDate(date) + space + DateTime.formatHour(date);
            // console.log(result);
            return result;
        }

        // Função que recebe data DD-MM-YYYY e devolve YYYY-MM-DD

    }, {
        key: 'DateToISO',
        value: function DateToISO(dateStr) {
            if (dateStr !== '') {
                return dateStr.split('/').reverse().join('/');
            } else {
                return '';
            }
        }

        // Função que recebe data DD-MM-YYYY e devolve UNIX TimeStamp

    }, {
        key: 'DateToTS',
        value: function DateToTS(dateStr) {
            if (dateStr !== '') {
                var ISODate = DateTime.DateToISO(dateStr);
                var TSDate = new Date(ISODate);

                return TSDate;
            } else {
                return '';
            }
        }

        // Função que recebe UNIX TimeStamp e devolve data DD-MM-YYYY

    }, {
        key: 'TSToDate',
        value: function TSToDate(TSValue) {
            if (TSValue !== '') {
                var fullDate = new Date(TSValue);
                return fullDate.getUTCDate() + '/' + (fullDate.getUTCMonth() + 1) + '/' + fullDate.getUTCFullYear();
            } else {
                return '';
            }
        }

        // Função que recebe frequencia e converte para intervalo de TimeStamp

    }, {
        key: 'freqToTS',
        value: function freqToTS(freqValue, daily) {
            if (daily) {
                return freqValue * 3600; // 60 minutos * 60 segundos
            } else {
                return freqValue * 86400; // 24 horas * 60 minutos * 60 segundos
            }
        }

        // Função que recebe data HH:MM e devolve UNIX TimeStamp

    }, {
        key: 'TimeToTS',
        value: function TimeToTS(TimeStr) {
            if (TimeStr !== '') {
                var timeVec = TimeStr.split(':');
                return timeVec[0] * 3600 + timeVec[1] * 60;
            } else {
                return '';
            }
        }
    }, {
        key: 'TSToTime',
        value: function TSToTime(TSValue) {
            if (TSValue !== '') {
                var minutes = Math.floor(TSValue % 3600 / 60);
                var hours = Math.floor(TSValue / 3600);
                hours = hours < 10 ? '0' + hours : hours;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                return hours + ':' + minutes;
            } else {
                return '';
            }
        }
    }, {
        key: 'RelativeDate',
        value: function RelativeDate(TimeStr) {
            var dueDate = (0, _moment2.default)(TimeStr, 'DD-MM-YYYY');
            if (dueDate.diff((0, _moment2.default)(), 'days') <= 6) {
                var date = dueDate.calendar().split(' às')[0];
                return date + ', ' + (0, _moment2.default)(TimeStr, 'DD-MM-YYYY').format('LL');
            } else {
                return (0, _moment2.default)(TimeStr, 'DD-MM-YYYY').format('LL');
            }
        }
    }, {
        key: 'TSToFreqString',
        value: function TSToFreqString(TimeStr) {
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
    }]);

    return DateTime;
}();

exports.default = DateTime;