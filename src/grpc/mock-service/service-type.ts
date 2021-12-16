export type IMetadataMap = Record<string, string | number | Buffer>;

type IResponseData = {
  /** mock 错误数据 */
  error?: {
    /** mock 错误码 */
    code: number;
    /** mock 错误信息 */
    message: string;
  };
  /** mock 正常响应数据 */
  response: any;
  /** mock metadata数据 */
  metadata?: IMetadataMap;
};

export type IImplementationData = Record<
  string,
  IResponseData & {
    /** mock 多场景响应数据 */
    sceneData?: (IResponseData & {
      /** mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配 */
      requestCase: (request: any) => boolean;
    })[];
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
