// Test setup file
process.env.NODE_ENV = "test";
process.env.MONGO_URI = "mongodb://localhost:27017";
process.env.MONGO_DB_NAME = "primetrade_test";
process.env.ACCESS_TOKEN_SECRET =
    "test_access_token_secret_key_for_testing_only";
process.env.REFRESH_TOKEN_SECRET =
    "test_refresh_token_secret_key_for_testing_only";
process.env.ACCESS_TOKEN_EXPIRY = "15m";
process.env.REFRESH_TOKEN_EXPIRY = "7d";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.LOG_LEVEL = "error";
