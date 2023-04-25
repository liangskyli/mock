import { register as esbuildRegister } from 'esbuild-register/dist/node';

let registered = false;

let revert: () => void = () => {};

export function register(opts: Parameters<typeof esbuildRegister>[0]) {
  if (!registered) {
    revert = esbuildRegister({
      target: `node${process.version.slice(1)}`,
      ...opts,
    }).unregister;
    registered = true;
  }
}

export function restore() {
  revert();
  registered = false;
}
