// =====================================================================
// CHỨC NĂNG ĐĂNG NHẬP BẰNG FACEBOOK - FACEBOOK AUTH GUARD
// =====================================================================

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {
  getAuthenticateOptions(_context: ExecutionContext) {
    return {
      scope: ['email'], // Cấu hình scope chuẩn tại đây
    };
  }
}
