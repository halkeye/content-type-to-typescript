import { ContentType } from 'contentful';
import { createClient } from 'contentful-management';
import * as fs from 'fs';
import { compileFromContentTypes } from './content-type-to-typescript';
import { logError, logSuccess } from './log';

async function fetchContentTypes({
  accessToken,
  spaceId,
  environmentId,
}: {
  accessToken: string;
  spaceId: string;
  environmentId: string;
}): Promise<ContentType[]> {
  try {
    const client = createClient({ accessToken });
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);

    let skip = 0;
    let contentTypes: any[] = [];
    while (true) {
      const { items, total } = await environment.getContentTypes({skip});
      contentTypes = contentTypes.concat(items);
      skip += items.length;

      if (skip >= total) {
        break;
      }
    }

    return contentTypes;
  } catch (err) {
    if (err.response && err.response.data) {
      logError(err.response.data.message);
    } else {
      logError(err);
    }

    throw err;
  }
}

async function compile(contentTypes: ContentType[], prefix?: string): Promise<string> {
  try {
    const ts = await compileFromContentTypes(contentTypes, undefined, prefix);
    return ts;
  } catch (err) {
    logError(err.message);
    throw err;
  }
}

function writeFile(output: string, ts: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(output, ts, (err) => {
      if (err) {
        logError(err.message);
        reject(err);
      } else {
        logSuccess('TypeScript Definitions were successfully created!');
        resolve();
      }
    });
  });
}

export default async function({
  accessToken,
  spaceId,
  environmentId,
  output,
  prefix,
}: {
  accessToken: string;
  spaceId: string;
  environmentId: string;
  output: string;
  prefix?: string
}) {
  const contentTypes = await fetchContentTypes({ accessToken, spaceId, environmentId });

  const ts = await compile(contentTypes, prefix);

  await writeFile(output, ts);
}
