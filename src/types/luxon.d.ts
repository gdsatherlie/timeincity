declare module "luxon" {
  export class DateTime {
    static now(): DateTime;
    static utc(): DateTime;
    static fromISO(value: string): DateTime;
    setZone(zone: string): DateTime;
    toFormat(format: string): string;
    get isValid(): boolean;
    get offset(): number;
    get offsetNameShort(): string;
    get offsetNameLong(): string;
  }
}
