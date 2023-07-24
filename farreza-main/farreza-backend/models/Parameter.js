const { model, Schema } = require("mongoose");
const { ParameterCollectionName, ParameterModelName } = require("../constants/parameter.constant");

const ParameterSchema = Schema({
    'title': { 'type': String, 'required': true },
    'key': { 'type': String, 'required': true },
    'value': { 'type': Number, 'required': true },
    'img': { 'type': String },
    'enabled': { 'type': Boolean, 'default': true }
}, { timestamps: true });

const Parameter = model(ParameterModelName, ParameterSchema, ParameterCollectionName);

module.exports = Parameter;
