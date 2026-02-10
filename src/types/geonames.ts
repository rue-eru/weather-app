export interface GeonamesResponse {
    timezoneId?: string;
    gmtOffset?: number;
    countryCode?: string;
    countryName?: string;
    status?: {
        message?: string;
        value?: number;
    }
}