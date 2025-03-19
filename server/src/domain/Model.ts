import type { z } from "zod";

export class Model<Schema extends z.ZodSchema> {
  #data;
  protected schema;

  constructor(schema: Schema, data: z.infer<Schema>) {
    this.schema = schema;
    this.#data = schema.parse(data);
  }

  public get data() {
    return this.#data;
  }

  public set data(newData: z.infer<Schema>) {
    this.#data = this.schema.parse({
      ...this.#data,
      ...newData,
    });
  }
}
