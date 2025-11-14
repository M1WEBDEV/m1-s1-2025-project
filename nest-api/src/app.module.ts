import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UploadController } from './modules/uploads/upload.controller';
import { AppService } from './app.service';
import { BookModule } from './modules/books/book.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthorModule } from './modules/authors/author.module';
import { ClientModule } from './modules/clients/client.module';
import { SaleModule } from './modules/sales/sale.module';

@Module({
  imports: [DatabaseModule, AuthorModule, BookModule, ClientModule, SaleModule],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
