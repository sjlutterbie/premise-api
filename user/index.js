'use strict';

const { User, EndpointsObject } = require('./models-user');
const { router } = require('./router-user');

module.exports = { User, EndpointsObject, router };