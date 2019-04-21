const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
 	MONGODB_URI : process.env.MONGODB_URI || "mongodb://localhost/dev",
  TOKEN_CLI : process.env.TOKEN_CLI || "5CD4ED173E1C95FE763B753A297D5"
};

const test = {
	MONGODB_URI : process.env.MONGODB_URI_TEST || "mongodb://localhost/test",
  TOKEN_CLI : process.env.TOKEN_CLI_TEST || "5CD4ED173E1C95FE763B753A297D5"
};

const config = {
 dev,
 test
};

module.exports = config[env];