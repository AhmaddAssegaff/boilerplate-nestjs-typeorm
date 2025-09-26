import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (
      | DynamicModule
      | Type<any>
      | Promise<DynamicModule>
      | ForwardReference<any>
    )[] = [];
    imports.push(AuthModule);
    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
