export type TBase = {
  projectId?: number;
  branchOrTag?: string;
  name: string;
  fullName: string;
  comment: string;
};

export type TField = {
  name: string;
  type: string;
  id: number;
  comment: string;
  required: boolean;
  repeated: boolean;
  defaultValue: any;
  bytes: boolean;
};

export type TMessage = TBase & {
  fields: TField[];
  filename: string | null;
};

export type TEnum = TBase & {
  values: Record<string, any>;
  comments: Record<string, string>;
  filename: string | null;
};

export type TMethod = TBase & {
  options?: any;
  requestStream?: boolean;
  requestType: string;
  responseStream?: boolean;
  responseType: string;
  type?: string;
  author?: string;
};

export type TService = TBase & {
  options?: any;
  methods?: TMethod[];
  author: string;
  filename: string | null;
};

/*export type TNamespace = {
  messages?: { [name: string]: TMessage };
  enums?: { [name: string]: TEnum };
  nested?: { [name: string]: TNamespace };
};

export type InitStartServicesConfig = {
  enable: boolean;
  exclude?: string[];
};*/
