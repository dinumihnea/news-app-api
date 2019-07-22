import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import { ALLOW_ORIGIN, MONGO_DB_URL } from './utils/constants';

// TODO extract to config file
const mongoURL = 'mongodb://localhost/news-app';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config(): void {
    mongoose.connect(MONGO_DB_URL || process.env.MONGODB_URI, {useNewUrlParser: true});

    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(logger('dev'));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());

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

    this.app.use('/', router);
    // TODO remove this
    router.get('/', ((req, res) => {
      res.json({
        message: 'It\'s work!'
      });
    }));
  }
}

export default new Server().app;
