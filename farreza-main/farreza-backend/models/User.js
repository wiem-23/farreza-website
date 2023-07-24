const { model, Schema } = require("mongoose");
const { VENDOR } = require("../constants/roles.constant");
const { UserModelName, UserStatues, UserCollectionName } = require("../constants/user.constant");
const User = model(UserModelName, {
  'email': {
    'unique': true,
    'type': String
  },
  'account': {
    'username': {
      'required': true,
      'type': String
    },
    'phone': { 'type': String },
    'avatar': { type: Schema.Types.Mixed, 'default': {} },
  },
  'role': {
    'type': String,
    'enum': UserStatues,
    'default': VENDOR
  },
  'token': { 'type': String },
  'hash': { 'type': String },
  'salt': { 'type': String },
}, UserCollectionName);

module.exports = User;
