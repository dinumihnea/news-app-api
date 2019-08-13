import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import * as config from 'config';
import { ALLOW_ORIGIN, MONGO_DB_URL } from './utils/constants';
import CategoryRouter from './models/categories';
import TagRouter from './models/tags';
import UserRouter from './models/users';
import NewsRouter from './models/news';
import AuthRouter from './auth';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  // TODO check Env variables before express starts.
  private static checkEnvVars(): void {
    const jwtPrivateKey = config.get('jwtPrivateKey');
    const prefix = config.get('prefix');
    const version = config.get('version');
    if (jwtPrivateKey && prefix && version) {
      console.error('Required environment variables are not defined.');
      process.exit(1);
    }
  }

  public config(): void {
    mongoose.connect(MONGO_DB_URL || process.env.MONGODB_URI, { useNewUrlParser: true })
      .then(() => console.log('Successfully connected to MongoDB.'))
      .catch(error => console.error('Error during MongoDB connection:', error));

    console.log(`${config.get('name')} is running in ${this.app.get('env')} environment.`);

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());

    // Make images public resources
    this.app.use(express.static('public'));

    if (this.app.get('env') === 'development') {
      this.app.use(logger('dev'));
    }

    this.app.use((_, res: express.Response, next: express.NextFunction) => {
      res.header('Access-Control-Allow-Origin', ALLOW_ORIGIN);
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });
  }

  public routes(): void {
    const router: express.Router = express.Router();

    this.app.use(`/${config.get('prefix')}/${config.get('version')}/`, router);
    this.app.use(`/${config.get('prefix')}/${config.get('version')}/news`, NewsRouter);
    this.app.use(`/${config.get('prefix')}/${config.get('version')}/tags`, TagRouter);
    this.app.use(`/${config.get('prefix')}/${config.get('version')}/users`, UserRouter);
    this.app.use(`/${config.get('prefix')}/${config.get('version')}/categories`, CategoryRouter);

    this.app.use(`/${config.get('prefix')}/${config.get('version')}/auth`, AuthRouter);
  }
}

export default new Server().app;
