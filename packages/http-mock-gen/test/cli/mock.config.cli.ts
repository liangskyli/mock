import { defineConfig } from '@liangskyli/http-mock-gen';

export default defineConfig([
  {
    mockDir: './test/all-gen-dirs/gen-mock-cli',
    openapiPath: new URL(
      '../example/openapi/openapiv3-example.json',
      import.meta.url,
    ),
  },
]);
