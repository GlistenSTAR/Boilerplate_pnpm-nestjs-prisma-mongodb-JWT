/*
| Developed by Glisten
| Filename : auth.guard.ts
| Author : Alexandre Schaffner (alexandre.s@Glisten.com)
*/

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

import { JwtPayload } from 'src/contracts/jwt-payload/jwt-payload.interface';

/*
|--------------------------------------------------------------------------
| AUTHENTICATION GUARD
|--------------------------------------------------------------------------
*/
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Try to retrieve the JWT from request's cookies
      //--------------------------------------------------------------------------
      const request: Request = context.switchToHttp().getRequest();

      const token: string = request.cookies['jwt'];
      if (!token) throw new UnauthorizedException();

      // Verify the JWT and check if it has been revoked
      //--------------------------------------------------------------------------
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        request.cookies['jwt'],
        { secret: process.env.JWT_SECRET },
      );

      if (
        await this.prisma.revokedToken.findUnique({
          where: { jti: payload.jti },
        })
      )
        throw new UnauthorizedException();

      // Attach user's data to the request
      //--------------------------------------------------------------------------
      request.user = payload;

      return true;
    } catch (err: unknown) {
      throw new UnauthorizedException();
    }
  }
}
