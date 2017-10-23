"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExtendableError = function (_Error) {
    _inherits(ExtendableError, _Error);

    function ExtendableError(message) {
        _classCallCheck(this, ExtendableError);

        var _this = _possibleConstructorReturn(this, (ExtendableError.__proto__ || Object.getPrototypeOf(ExtendableError)).call(this));

        _this.message = message;
        _this.stack = new Error().stack;
        _this.name = _this.constructor.name;
        return _this;
    }

    return ExtendableError;
}(Error);

var JSError = function (_ExtendableError) {
    _inherits(JSError, _ExtendableError);

    function JSError(m) {
        _classCallCheck(this, JSError);

        return _possibleConstructorReturn(this, (JSError.__proto__ || Object.getPrototypeOf(JSError)).call(this, m));
    }

    return JSError;
}(ExtendableError);

exports.default = JSError;