export interface Flight {
    hasExtendedFare: boolean;
    flight:          FlightClass;
    flightToken:     string;
}

export interface FlightClass {
    carrier:                             Carrier;
    price:                               Price;
    servicesStatuses:                    ServicesStatuses;
    legs:                                Leg[];
    exchange:                            Exchange;
    isTripartiteContractDiscountApplied: boolean;
    international:                       boolean;
    seats:                               Seat[];
    refund:                              Refund;
}

export interface Carrier {
    uid:         string;
    caption:     string;
    airlineCode: string;
}

export interface Exchange {
    ADULT: ExchangeADULT;
}

export interface ExchangeADULT {
    exchangeableBeforeDeparture: boolean;
    exchangeAfterDeparture:      Total;
    exchangeBeforeDeparture:     Total;
    exchangeableAfterDeparture:  boolean;
}

export interface Total {
    amount:       string;
    currency:     string;
    currencyCode: string;
}

export interface Leg {
    duration: number;
    segments: Segment[];
}

export interface Segment {
    classOfServiceCode: string;
    classOfService:     Baggage;
    departureAirport:   Baggage;
    departureCity:      Baggage;
    aircraft:           Baggage;
    travelDuration:     number;
    arrivalCity:        Baggage;
    arrivalDate:        Date;
    flightNumber:       string;
    techStopInfos:      any[];
    departureDate:      Date;
    stops:              number;
    servicesDetails:    ServicesDetails;
    airline:            Carrier;
    starting:           boolean;
    arrivalAirport:     Baggage;
    operatingAirline?:  Carrier;
}

export interface Baggage {
    uid:     string;
    caption: string;
}

export interface ServicesDetails {
    freeCabinLuggage: Luggage;
    paidCabinLuggage: Luggage;
    tariffName:       string;
    fareBasis:        FareBasis;
    freeLuggage:      FreeLuggage;
    paidLuggage:      Luggage;
}

export interface FareBasis {
    ADULT: string;
}

export interface Luggage {
}

export interface FreeLuggage {
    ADULT: FreeLuggageADULT;
}

export interface FreeLuggageADULT {
    pieces: number;
    nil:    boolean;
    unit:   string;
}

export interface Price {
    total:            Total;
    totalFeeAndTaxes: Total;
    rates:            Rates;
    passengerPrices:  PassengerPrice[];
}

export interface PassengerPrice {
    total:                Total;
    passengerType:        Baggage;
    singlePassengerTotal: Total;
    passengerCount:       number;
    tariff:               Total;
    feeAndTaxes:          Total;
}

export interface Rates {
    totalUsd: TotalUsdClass;
    totalEur: TotalEurClass;
}

export interface TotalUsdClass {
    amount:       string;
    currencyCode: string;
}
export interface TotalEurClass {
    amount:       string;
    currencyCode: string;
}

export interface Refund {
    ADULT: RefundADULT;
}

export interface RefundADULT {
    refundableBeforeDeparture: boolean;
    refundableAfterDeparture:  boolean;
}

export interface Seat {
    count: number;
    type:  Baggage;
}

export interface ServicesStatuses {
    baggage:  Baggage;
    exchange: Baggage;
    refund:   Baggage;
}

// BestPrices
export interface BestPrices {
    ONE_CONNECTION: OneConnection;
    DIRECT: Direct;
}

export interface OneConnection {
    bestFlights: BestFlight[];
}
export interface Direct {
    bestFlights: BestFlight[];
}

export interface BestFlight {
    carrier: Carrier;
    price:   Price;
}

export interface Carrier {
    uid:         string;
    caption:     string;
    airlineCode: string;
}

export interface Price {
    amount:       string;
    currency:     string;
    currencyCode: string;
}

