export function getCurrentUnixTimestamp(): number {
    return Math.floor(new Date().getTime() / 1000);
}
