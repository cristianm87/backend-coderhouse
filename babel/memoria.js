"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Memoria = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Memoria = /*#__PURE__*/function () {
  function Memoria() {
    _classCallCheck(this, Memoria);

    this.array = [];
    this.count = 0;
  }

  _createClass(Memoria, [{
    key: "getArray",
    value: function getArray() {
      return this.array;
    }
  }, {
    key: "getElementById",
    value: function getElementById(id) {
      var result = this.array.find(function (element) {
        return element.id === Number(id);
      });
      return result;
    }
  }, {
    key: "addElement",
    value: function addElement(objeto) {
      this.array.push(_objectSpread(_objectSpread({}, objeto), {}, {
        id: this.count + 1
      }));
      this.count++;
      return objeto;
    }
  }, {
    key: "updateObject",
    value: function updateObject(newProduct, id) {
      var index = this.array.findIndex(function (element) {
        return element.id === Number(id);
      });
      this.array[index] = newProduct;
    }
  }, {
    key: "deleteObject",
    value: function deleteObject(id) {
      var index = this.array.findIndex(function (element) {
        return element.id === Number(id);
      });
      this.array.splice(index, 1);
    }
  }]);

  return Memoria;
}();

exports.Memoria = Memoria;
