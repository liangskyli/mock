import { program } from 'commander';
import { mockServerLoadScript } from '../mock-service';

const commandServerStartCli = (version: string) => {
  program
    .version(version)
    .option<boolean>(
      '-w, --watch [watch]',
      'watch mock files change',
      (watch) => {
        return watch.toString() === 'true';
      },
      true,
    )
    .option('-c, --configFile [configFile]', 'grpc mock config file')
    .parse(process.argv);

  const { watch, configFile } = program.opts();
  mockServerLoadScript({ watch, configFile });
};

export { commandServerStartCli };
