import type { Options } from '@grpc/proto-loader';
import type { IPrettierOptions } from '@liangskyli/utils';
import {
  colors,
  copyOptions,
  getAbsolutePath,
  prettierData,
  removeFilesSync,
  winPath,
} from '@liangskyli/utils';
import * as fs from 'fs-extra';
import path from 'path';
import protobufjs from 'protobufjs';
import {
  fileTip,
  firstUpperCaseOfWord,
  firstWordNeedLetter,
  packageName,
} from '../utils';
import type { ProtoConfig } from './file/gen-root-json';
import { GenRootJson } from './file/gen-root-json';
import type { IInspectNamespace } from './pbjs';
import { genImplementationData, inspectNamespace } from './pbjs';

export type GenMockDataOptions = {
  grpcMockDir?: string;
  grpcMockFolderName?: string;
  port?: number;
  rootPath: ProtoConfig | string;
  rootPathServerNameMap?: Record<string, string>;
  prettierOptions?: IPrettierOptions;
};

const genDefaultCustomData = (
  genCustomDataPath: string,
  prettierOptions?: IPrettierOptions,
) => {
  if (!fs.pathExistsSync(path.join(genCustomDataPath, 'index.ts'))) {
    fs.ensureDirSync(genCustomDataPath);
    // 生成默认自定义mock数据入口文件
    let templatePath = path.join(
      __dirname,
      './custom-data-template/template-data.tpl',
    );
    if (!fs.pathExistsSync(templatePath)) {
      // build path
      templatePath = path.join(
        __dirname,
        './gen/custom-data-template/template-data.tpl',
      );
    }
    const templateData = fs.readFileSync(templatePath, { encoding: 'utf-8' });
    fs.writeFileSync(
      path.join(genCustomDataPath, 'template-data.ts'),
      prettierData(
        templateData.replace('packageName', packageName),
        copyOptions(prettierOptions),
      ),
    );
    let templateIndexPath = path.join(
      __dirname,
      './custom-data-template/index.tpl',
    );
    if (!fs.pathExistsSync(templateIndexPath)) {
      // build path
      templateIndexPath = path.join(
        __dirname,
        './gen/custom-data-template/index.tpl',
      );
    }
    const templateIndexData = fs.readFileSync(templateIndexPath, {
      encoding: 'utf-8',
    });
    fs.writeFileSync(
      path.join(genCustomDataPath, 'index.ts'),
      prettierData(
        templateIndexData.replace('packageName', packageName),
        copyOptions(prettierOptions),
      ),
    );
  }
};

const genMockData = async (
  opts: GenMockDataOptions,
  loaderOptions: Options,
): Promise<{
  rootPath: string;
  genMockPath: string;
}> => {
  const {
    grpcMockDir = './',
    grpcMockFolderName = 'grpc-mock',
    port = 50000,
    rootPathServerNameMap,
    prettierOptions,
  } = opts;
  let { rootPath } = opts;
  const genMockPath = path.join(grpcMockDir, grpcMockFolderName);
  const genMockAbsolutePath = getAbsolutePath(genMockPath);

  removeFilesSync(genMockAbsolutePath);
  console.info(colors.green(`Clean dir: ${genMockPath}`));

  const genCustomDataPath = path.join(genMockAbsolutePath, 'custom-data');
  genDefaultCustomData(genCustomDataPath, prettierOptions);

  const genProtoPath = path.join(genMockAbsolutePath, 'proto');
  fs.ensureDirSync(genProtoPath);
  const genServerPath = path.join(genMockAbsolutePath, 'server');
  fs.ensureDirSync(genServerPath);
  if (typeof rootPath !== 'string') {
    const genRootJson = new GenRootJson({
      genMockPath,
      ...rootPath,
      loaderOptions,
      prettierOptions,
    });
    rootPath = genRootJson.writeFile();
  }
  rootPath = getAbsolutePath(rootPath);

  // mock 服务端口开始自动生成(默认从50000开始)
  let servicePort = port;
  const grpcServiceMockConfigList: string[] = [];
  grpcServiceMockConfigList.push(fileTip);
  grpcServiceMockConfigList.push('module.exports = {');
  const spaceServerNameMockList: string[] = [];
  const indexContent: string[] = [];
  indexContent.push(fileTip);
  indexContent.push(`import grpcMockInit from '${packageName}';`);

  const rootObject = require(rootPath);
  await Promise.all(
    Object.keys(rootObject).map(async (spaceServerName) => {
      const serverName: string =
        rootPathServerNameMap?.[spaceServerName] ?? spaceServerName;
      const root = protobufjs.Root.fromJSON(rootObject[spaceServerName]);
      const result: IInspectNamespace = inspectNamespace(root);
      const { services, methods } = result!;
      const serviceMockContent = [];
      serviceMockContent.push(fileTip);
      serviceMockContent.push(
        `import type { IMockService } from '${packageName}';`,
      );
      const protoItem: string[] = [];
      const uniqueServiceCodeNameList: string[] = [];
      const longsTypeToString = loaderOptions.longs === String;

      await Promise.all(
        services.map(async (service, index) => {
          const protoName = service.fullName.split('.')[0];
          const protoPath = `${spaceServerName}.${service.fullName}`;
          const serviceCodeName = firstWordNeedLetter(service.name);
          let uniqueServiceCodeName = serviceCodeName;

          // 导出服务变量名唯一处理
          if (uniqueServiceCodeNameList.indexOf(uniqueServiceCodeName) > -1) {
            uniqueServiceCodeName = `${uniqueServiceCodeName}${index}`;
          }
          uniqueServiceCodeNameList.push(uniqueServiceCodeName);

          const protoServiceContent = `${fileTip}
            // 自定义mock数据，请在custom-data文件夹下编写，详细见custom-data/index.ts文件说明
            import type { IProtoItem } from '${packageName}';
            import CustomData from '${winPath(genCustomDataPath)}/index';
            
            const ${serviceCodeName}: IProtoItem = {
              path: '${protoPath}',
              implementationData: ${genImplementationData(
                protoPath,
                methods,
                protoName,
                root,
                longsTypeToString,
              )}
            };
            export default ${serviceCodeName};
            `;
          fs.ensureDirSync(path.join(genProtoPath, serverName, protoName));
          const filePath = path.join(
            genProtoPath,
            serverName,
            protoName,
            `${serviceCodeName}.ts`,
          );
          fs.writeFileSync(
            filePath,
            prettierData(protoServiceContent, copyOptions(prettierOptions)),
          );

          serviceMockContent.push(
            `import ${uniqueServiceCodeName} from '../proto/${serverName}/${protoName}/${serviceCodeName}';`,
          );
          protoItem.push(`{ ...${uniqueServiceCodeName} },`);
        }),
      );
      const spaceServerNameMock = `${firstUpperCaseOfWord(
        spaceServerName,
      )}Mock`;
      serviceMockContent.push(`
const ${spaceServerNameMock}: IMockService = {
  serviceName: '${serverName}',
  servicePort: ${servicePort},
  protoList: [
    ${protoItem.join('\n')}
  ],
};
export default ${spaceServerNameMock};
    `);
      grpcServiceMockConfigList.push(
        ` '${serverName}': {
    'host': '127.0.0.1',
    'port': ${servicePort},
  },`,
      );
      servicePort++;
      const filePath = path.join(genServerPath, `${spaceServerNameMock}.ts`);
      fs.writeFileSync(
        filePath,
        prettierData(
          serviceMockContent.join('\n'),
          copyOptions(prettierOptions),
        ),
      );
      spaceServerNameMockList.push(spaceServerNameMock);
      indexContent.push(
        `import ${spaceServerNameMock} from './server/${spaceServerNameMock}';`,
      );
    }),
  );
  // index.ts
  indexContent.push('');
  indexContent.push(`grpcMockInit([
  ${spaceServerNameMockList.join(',')}
],'${winPath(genMockPath)}');`);
  const filePath = path.join(genMockPath, 'index.ts');
  fs.writeFileSync(
    filePath,
    prettierData(indexContent.join('\n'), copyOptions(prettierOptions)),
  );
  grpcServiceMockConfigList.push('}');
  const fileConfigPath = path.join(genMockPath, 'grpc-service.mock.config.js');
  fs.writeFileSync(
    fileConfigPath,
    prettierData(
      grpcServiceMockConfigList.join('\n'),
      copyOptions(prettierOptions),
    ),
  );
  console.info(colors.green(`Generate mock data success in ${genMockPath}`));

  return { rootPath, genMockPath };
};

export default genMockData;
