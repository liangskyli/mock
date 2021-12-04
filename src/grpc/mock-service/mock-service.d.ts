export type IMetadataMap = Record<string, string | number | Buffer>;

export type IImplementationData = Record<
  string,
  {
    /** mock 错误数据 */
    error?: { code: number; message: string };
    /** mock 响应数据 */
    response: any;
    /** mock metadata数据 */
    metadata?: IMetadataMap;
  }
>[];

export type IProtoItem = {
  /** 服务所在的proto路径， 生成grpc mock 代码里生成的服务文件可以看到 */
  path: string;
  /** 需要mock的grpc方法和数据 */
  implementationData: IImplementationData;
};

export type IMockService = {
  /** mock服务名*/
  serviceName: string;
  /** mock服务端口号*/
  servicePort: number;
  /** proto文件里对应服务*/
  protoList: IProtoItem[];
};
