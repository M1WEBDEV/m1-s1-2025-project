import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './create-client.dto';
import { ClientModel } from './models/client.model';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto): Promise<ClientModel> {
    if (!createClientDto.picture && (createClientDto as any).pictureUrl) {
      createClientDto.picture = (createClientDto as any).pictureUrl;
    }
    return this.clientService.create(createClientDto);
  }

  @Get()
  findAll(): Promise<ClientModel[]> {
    return this.clientService.findAll();
  }

  @Get('with-client-count')
  getWithBookCount(): Promise<Array<ClientModel & { booksCount: number }>> {
    return this.clientService.getClientsWithBookCount();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ClientModel> {
    return this.clientService.findOne(id);
  }

  @Get(':id/books')
  getBooksBought(@Param('id') id: string) {
    return this.clientService.findBooksBoughtByClient(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: CreateClientDto): Promise<ClientModel> {
    if (!updateClientDto.picture && (updateClientDto as any).pictureUrl) {
      updateClientDto.picture = (updateClientDto as any).pictureUrl;
    }
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.clientService.remove(id);
  }
}
