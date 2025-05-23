import express from 'express'
import session from 'express-session';
import passport from './config/passportConfig.js'
import authRouter from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import cors from 'cors'
import modelRoutes from "./routes/modelRoutes.js";
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';

const pgSession = connectPgSimple(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
pgPool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL!'))
    .catch(err => console.error('❌ PG connection error:', err));

const app = express()

const port = process.env.PORT;

app.use(cors({
  origin: 'https://hieroglyph-yad7.onrender.com',
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: 'hieroglyph-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // true in production (HTTPS)
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));


app.use(passport.initialize());
app.use(passport.session());

app.get('/api/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ user: null });
  }
});

app.get('/', (req, res) => {
  res.json({ message: "Welcome to hieroglyph api."});
});

app.use('/api/auth', authRouter);
app.use('/api/documents', documentRoutes);
app.use('/api/model', modelRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});