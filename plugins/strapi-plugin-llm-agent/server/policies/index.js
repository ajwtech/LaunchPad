/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

const rateLimit = require('./rate-limit');
const validateContentType = require('./validate-content-type');

module.exports = {
  'rate-limit': rateLimit,
  'validate-content-type': validateContentType,
};