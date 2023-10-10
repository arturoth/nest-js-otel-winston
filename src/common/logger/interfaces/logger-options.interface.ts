import { ModuleMetadata } from '@nestjs/common';

export interface LoggerOptions {
  environment?: string;
  app_id?: string;
  level?: string;
  [key: string]: any;
}
export interface LoggerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => LoggerOptions;
  inject: any[];
  [key: string]: any;
}
