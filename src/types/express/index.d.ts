import { JwtPayload } from 'src/contracts/jwt-payload/jwt-payload.interface';

/*
|--------------------------------------------------------------------------
| CUSTOM EXPRESS REQUEST TO ADD USER PROPERTY
|--------------------------------------------------------------------------
*/
declare global {
  namespace Express {
    export interface Request {
      user: JwtPayload;
    }
  }
}
