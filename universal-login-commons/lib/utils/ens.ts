export function parseDomain(ensName : string) : string [] {
    return ensName.split(/\.(.*)/).slice(0, 2);
}
