"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatapp = exports.sendSms = exports.gmailTransporterInit = exports.etherealTransporterInit = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var twilio_1 = __importDefault(require("twilio"));
var server_1 = require("../server");
//////////// EMAILING ////////////
// ETHEREAL
var etherealTransporterInit = function (status, userInfo) {
    var userData = JSON.stringify(userInfo);
    var etherealTransporter = nodemailer_1.default.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: server_1.adminData.emailEthereal.address,
            pass: server_1.adminData.emailEthereal.password,
        },
    });
    var date = new Date().toLocaleString('es-AR');
    var message = "".concat(userData, " hizo ").concat(status, " el: ").concat(date);
    var mailOptions = {
        from: 'Prueba',
        to: server_1.adminData.emailEthereal.address,
        subject: status,
        html: message,
    };
    etherealTransporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return error;
        }
        return;
    });
};
exports.etherealTransporterInit = etherealTransporterInit;
// GMAIL
var gmailTransporterInit = function (userData) {
    var gmailTransporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: server_1.adminData.emailGmail.address,
            pass: server_1.adminData.emailGmail.password,
        },
    });
    var mailOptions = {
        to: 'email2cristian@gmail.com',
        subject: 'login',
        html: "<h1>El usuario ".concat(userData.email, " se ah logueado</h1>"),
    };
    var attachmentPath = userData.avatar;
    if (attachmentPath) {
        mailOptions.attachments = [
            {
                path: attachmentPath,
            },
        ];
    }
    gmailTransporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return error;
        }
        return;
    });
};
exports.gmailTransporterInit = gmailTransporterInit;
// TWILIO (SMS)
var sendSms = function (info, text, phoneNumber) {
    var userDatail = JSON.stringify(info);
    var client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var message, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.messages.create({
                            body: "Detalle: ".concat(userDatail, " asunto: \"").concat(text, "\""),
                            from: '+12183282116',
                            to: phoneNumber,
                        })];
                case 1:
                    message = _a.sent();
                    console.log(message.sid);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
};
exports.sendSms = sendSms;
// TWILIO (WHATSAPP)
var sendWhatapp = function (detalleDeCompra) {
    var detalle = JSON.stringify(detalleDeCompra);
    var client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var message, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.messages.create({
                            body: detalle,
                            from: 'whatsapp:+14155238886',
                            to: "whatsapp:".concat(server_1.adminData.whatsappNumber),
                        })];
                case 1:
                    message = _a.sent();
                    console.log(message.sid);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
};
exports.sendWhatapp = sendWhatapp;
exports.default = {
    etherealTransporterInit: exports.etherealTransporterInit,
    gmailTransporterInit: exports.gmailTransporterInit,
    sendSms: exports.sendSms,
    sendWhatapp: exports.sendWhatapp,
};
