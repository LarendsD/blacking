import { SetMetadata } from '@nestjs/common';
import { Action } from '../../casl/action.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: Action[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
