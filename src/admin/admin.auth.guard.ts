import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAuthGuard extends AuthGuard('access') implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const canActivate = super.canActivate(context);

    if (canActivate instanceof Promise) {
      return canActivate.then((result) => {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (result && user && user.role === 'admin') {
          return true;
        }

        throw new UnauthorizedException();
      });
    } else if (typeof canActivate === 'boolean') {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (canActivate && user && user.role === 'admin') {
        return true;
      }

      throw new UnauthorizedException();
    } else {
      throw new UnauthorizedException();
    }
  }
}
