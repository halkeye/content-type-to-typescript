export default function ({accessToken, space, environment, output, prefix}: {
    accessToken: string;
    space: string;
    environment: string;
    output: string;
    prefix?: string;
}): Promise<void>;
