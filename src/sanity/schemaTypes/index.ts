import { matchType } from "./matchType";
import { md3Type } from "./md3Type";
import { personType } from "./personType";
import { type SchemaTypeDefinition } from "sanity";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [personType, md3Type, matchType],
};
