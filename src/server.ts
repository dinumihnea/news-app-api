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
import TagsRouter from './tags/TagsRouter';
import NewsRouter from './news/NewsRouter';
import BookmarksRouter from './bookmarks/BookmarksRouter';
import CategoryRouter from './categories/CategoryRouter';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config(): void {
    mongoose.connect(MONGO_DB_URL || process.env.MONGODB_URI, {useNewUrlParser: true})
      .then(() => console.log('Successfully connected to MongoDB.'))
      .catch(error => console.error('Error during MongoDB connection:', error));

    console.log(`${config.get('name')} is running in ${this.app.get('env')} environment.`);

    this.app.use(bodyParser.urlencoded({extended: true}));
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
        'GET, POST, PUT, DELETE, OPTIONS',
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials',
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });
  }

  public routes(): void {
    const router: express.Router = express.Router();

    this.app.use(`/${config.get('prefix')}/${config.get('version')}/`, router);
    this.app.use(`/${config.get('prefix')}/${config.get('version')}/news`, NewsRouter);
    this.app.use(`/${config.get('prefix')}/${config.get('version')}/tags`, TagsRouter);
    this.app.use(`/${config.get('prefix')}/${config.get('version')}/bookmarks`, BookmarksRouter);
    this.app.use(`/${config.get('prefix')}/${config.get('version')}/categories`, CategoryRouter);
  }
}

export default new Server().app;
