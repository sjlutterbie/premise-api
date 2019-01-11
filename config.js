exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/premise-test';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/premise-production';
exports.PORT = process.env.PORT || 8081;
exports.JWT_SECRET = process.env.JWT_SECRET  || 'process.env.JWT_SECRET not loaded';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';