import { register as esbuildRegister } from 'esbuild-register/dist/node';

let revertList: { key: string; revert: () => void }[] = [];

export const register = (
  opts: Parameters<typeof esbuildRegister>[0] & { key: string },
) => {
  const { key, ...otherOpts } = opts;
  if (revertList.filter((item) => item.key === key).length > 0) {
    throw Error('register key have exist!');
  }
  const revert = esbuildRegister({
    target: `node${process.version.slice(1)}`,
    ...otherOpts,
  }).unregister;
  revertList.push({ key, revert });

  const unregister = () => {
    revert();
    revertList = revertList.filter((item) => item.key !== key);
  };

  return {
    unregister,
  };
};

export const restore = () => {
  revertList.forEach(({ revert }) => {
    revert();
  });
  revertList = [];
};

export const unregister = (key: string) => {
  revertList = revertList
    .map((item) => {
      if (item.key === key) {
        item.revert();
        return true;
      } else {
        return item;
      }
    })
    .filter((item) => item !== true) as unknown as typeof revertList;
};
