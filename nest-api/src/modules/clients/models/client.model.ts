export interface ClientModel {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  picture?: string;
}

export interface CreateClientModel {
  firstName: string;
  lastName: string;
  email?: string;
  picture?: string;
}

export interface UpdateClientModel {
  firstName?: string;
  lastName?: string;
  email?: string;
  picture?: string;
}
