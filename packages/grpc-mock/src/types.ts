import type {
  Enum,
  Field,
  INamespace,
  IService,
  IType,
  Method,
  ReflectionObject,
  Service,
} from 'protobufjs';

type TBase = Pick<ReflectionObject, 'name' | 'fullName' | 'comment'>;

export type TField = Pick<
  Field,
  | 'defaultValue'
  | 'name'
  | 'type'
  | 'id'
  | 'comment'
  | 'required'
  | 'repeated'
  | 'bytes'
>;

export type TMessage = TBase & {
  fields: TField[];
  filename: string | null;
};
export type TNamespace = TBase & INamespace;
export type TType = TBase & IType;
export type TEnum = TBase & Pick<Enum, 'values' | 'filename' | 'comments'>;
export type TServiceJson = TBase & IService;
export type TMethod = TBase &
  Pick<
    Method,
    | 'options'
    | 'requestStream'
    | 'requestType'
    | 'responseStream'
    | 'responseType'
    | 'type'
  >;

export type TService = TBase &
  Pick<Service, 'options' | 'filename'> & {
    methods: TMethod[];
  };
