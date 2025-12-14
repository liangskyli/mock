import { fs, getAbsolutePath } from '@liangskyli/utils';
import type { Plugin } from 'rolldown';

type CopyPluginOptions = {
  targets: {
    src: string;
    dest: string;
  }[];
};

const copyPlugin: (options: CopyPluginOptions) => Plugin = (options) => {
  const { targets } = options;
  return {
    name: 'rolldown-plugin-copy',
    generateBundle() {
      targets.forEach((target) => {
        const { src, dest } = target;
        fs.copySync(getAbsolutePath(src), getAbsolutePath(dest));
      });
    },
  };
};

export default copyPlugin;
