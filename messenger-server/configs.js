const PORT = 12345;
exports.PORT = PORT;

const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET, POST",
    allowedHeaders: 'Content-Type, Authorization, Access-Control-Allow-Origin',
    credentials: true,
};
exports.corsOptions = corsOptions;

const db_server = process.env.MONGODB_URI;
exports.db_server = db_server;