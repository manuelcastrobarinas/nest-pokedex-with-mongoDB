import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { CONFIG } from './env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load:[CONFIG]
    }),
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','public'),
    }),

    MongooseModule.forRoot(CONFIG().mongodb),
    PokemonModule,
    CommonModule,
    SeedModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
