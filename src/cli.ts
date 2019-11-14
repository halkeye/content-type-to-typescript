import * as program from 'commander';
import compileFromSpace from './compile-from-space';
import { logError } from './log';
// tslint:disable:no-console

const ensureArgNotEmpty = (value: string, message: string): void => {
  if (!value) {
    logError(message);
    process.exit(1);
  }
};

program
  .option(
    '--management-token <managementToken>',
    // tslint:disable-next-line:max-line-length
    'This is the management token for this space. You can generate the token in the Contentful web app. Learn more at https://www.contentful.com/developers/docs/references/authentication/',
  )
  .option('--space <space>', 'This is the space ID')
  .option('--environment <environment>', 'This is the environment, defaults to "master"')
  .option('--output <output>', 'Output filename: e.g. -o ./types.ts')
  .option('--prefix <prefix>', 'prefix used for interface names e.g. "Contentful"');

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log(
    '    $ content-type-to-typescript --management-token <token> --space <space> --environment <environment> --output <filename>',
  );
  console.log(
    '    $ content-type-to-typescript --management-token=<token> --space=<space> --environment <environment> --output=<filename>',
  );
  console.log('');
});

program.parse(process.argv);

// tslint:disable:no-console

ensureArgNotEmpty(program.managementToken, 'Management token is missing.');
ensureArgNotEmpty(program.space, 'Space is missing.');
ensureArgNotEmpty(program.output, 'Output file path is missing.');

compileFromSpace({
  managementToken: program.managementToken,
  spaceId: program.space,
  environmentId: program.environment || 'master',
  output: program.output,
  prefix: program.prefix,
})
  .then(() => process.exit())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
