export function parseDomain(ensName : string) : string [] {
    return ensName.split(/\.(.*)/).slice(0, 2);
}

export const ensNameElementRegex = /^[a-z0-9](\-*[a-z0-9]+)*$/;

export const isValidEnsNameElement = (ensNameElement: string) => {
    return ensNameElementRegex.test(ensNameElement);
};
