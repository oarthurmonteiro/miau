import { PrismaClient, type Prisma } from "@prisma/client";

type ClientPrisma = {
  _client: PrismaClient;
  _tx?: Prisma.TransactionClient;
  getClient: () => Prisma.TransactionClient | PrismaClient;
  tx: <T extends unknown[]>(queries: { [I in keyof T]: () => Promise<T[I]> }) => Promise<T>;
};

export const prisma: ClientPrisma = {
  _client: new PrismaClient(),

  _tx: undefined,

  getClient: () => {
    return prisma._tx || prisma._client;
  },

  // TODO: back here some day
  tx: async (queries) => {
    return await prisma._client.$transaction(async (tx) => {
      try {
        prisma._tx = tx;
        return await Promise.all(queries.map(q => q()));
      } finally {
        prisma._tx = undefined;
      }
    });
  },  
};