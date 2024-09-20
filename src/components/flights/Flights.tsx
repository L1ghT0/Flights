import React, { ChangeEvent, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { FlightCard } from "./FlightCard";
import { useState } from "react";
import { BestFlight, BestPrices, Flight, OneConnection, Direct } from "../../types/types";
import './flights.scss'

type FlightsProps = {}

export const Flights:React.FC<FlightsProps> = () => {

    const {flights: flightsFromStore, bestPrices: bestPricesFromStore} = useSelector((store:RootState) => store.flights)

    const [flights, setFlights]                = useState<Flight[]>(flightsFromStore)
    const [bestPrices, setBestPrices]          = useState<BestPrices>(bestPricesFromStore)
    const [filtersApplied, setFiltersApplied]  = useState<Array<{type: keyof filterTypes, value: string}>>([])

    type sortTypes = {
        lowPrice:  () => Flight[],
        highPrice: () => Flight[],
        duration:  () => Flight[]
    }
    
    const sortBy:sortTypes = {
        lowPrice:  () => flights.slice().sort((a,b) => Number(a.flight.price.total.amount) - Number(b.flight.price.total.amount)),
        highPrice: () => flights.slice().sort((a,b) => Number(b.flight.price.total.amount) - Number(a.flight.price.total.amount)),
        duration:  () => flights.slice().sort((a,b) => Number(a.flight.legs.reduce((acc, leg) => acc -= -leg.duration ,0)) - Number(b.flight.legs.reduce((acc, leg) => acc -= -leg.duration ,0)))
    } 

    const handleSort = (sortType: keyof sortTypes) => {
        return (e:ChangeEvent) => {
            let sortedArray = sortBy[sortType]()
            if(sortedArray.length) setFlights(sortedArray);
        }
    }

   
    type filterTypes = {
        maxPrice: (price: string, arr: Flight[])      => Flight[],
        minPrice: (price: string, arr: Flight[])      => Flight[],
        stops:    (numOfStops: string, arr: Flight[]) => Flight[],
        carrier:  (carrier: string, arr: Flight[])    => Flight[]
    }

    const filterBy: filterTypes = {
        maxPrice: (price: string, arr: Flight[])      => arr.filter(flight => Number(flight.flight.price.total.amount) <= Number(price)),
        minPrice: (price: string, arr: Flight[])      => arr.filter(flight => Number(flight.flight.price.total.amount) >= Number(price)),
        stops:    (numOfStops: string, arr: Flight[]) => arr.filter(flight => flight.flight.legs[0].segments.length - 1 === Number(numOfStops)),
        carrier:  (carrier: string, arr: Flight[])    => arr.filter(flight => flight.flight.carrier.caption === carrier)
    }

    const handleFilter = (filterType: keyof filterTypes, value: string) => {
        return (e:ChangeEvent<HTMLInputElement>) => {

            if(e.target.type === 'checkbox' && e.target.checked) {
                setFiltersApplied([...filtersApplied, {type: filterType, value}])
            } else if (e.target.type === 'text' && e.target.value ) {
                setFiltersApplied([...filtersApplied.filter(filter => filter.type !== filterType), {type: filterType, value}])

            } else {
                if(filterType === 'carrier' || filterType === 'stops') {
                    setFiltersApplied(filtersApplied.filter(filter => filter.value !== value))
                } else{
                    setFiltersApplied(filtersApplied.filter(filter => filter.type !== filterType))
                }
            }
        }
    }
    
    const [listSize, setListSize] = useState<number>(4)
    const handleShowMore = (size: number) => {
        return (e: React.MouseEvent<HTMLInputElement>) => {
            setListSize(listSize + size)
        }
    }

    const getListOfAirlines = () => {
        let airlines:BestFlight[] = [];
        let key: keyof BestPrices;
        for(key in bestPrices){
            if (bestPrices.hasOwnProperty(key)){
                bestPrices[key].bestFlights.forEach( flight => {
                    let b_flight = airlines.find(b_flight => b_flight.carrier.caption === flight.carrier.caption)
                    if(b_flight) {
                        if(b_flight.price.amount >= flight.price.amount){
                            airlines = [...airlines.filter(airline => airline.carrier.caption !== b_flight.carrier.caption), b_flight]
                        }
                    } else {
                        airlines.push(flight)
                    }
                })
            }
        }
        return airlines;
    }
    const listOfAirlines = getListOfAirlines();

    const getIntersection = ( [ arr1, arr2, arr3, arr4 ]:Array<Flight[]> ) => {
        arr1 = arr1.length ? arr1 : flights 
        arr2 = arr2.length ? arr2 : flights
        return arr1.filter(element => arr2.includes(element) && arr3.includes(element) && arr4.includes(element));
    }


    return (
        <div className="flights">
            <aside className="flights_settings">
                <div className="flights_sorts"> {/* sort */}
                    <h2 className="flights_aside_title">Сортировать</h2>
                    <div className="flights_sortVariants">
                        <div>
                            <input type="radio" name="sort" id="lowPrice" onChange={handleSort('lowPrice')}/>
                            <label htmlFor="lowPrice"> - по возрастанию цены</label>
                        </div>
                        <div>
                            <input type="radio" name="sort" id="highPrice" onChange={handleSort('highPrice')}/>
                            <label htmlFor="highPrice"> - по убыванию цене</label>
                        </div>
                        <div>
                            <input type="radio" name="sort" id="duration" onChange={handleSort('duration')}/>
                            <label htmlFor="duration"> - по времени в пути</label>
                        </div>
                    </div>
                </div>
                <div className="flights_filters"> {/* filter */}
                    <h2 className="flights_aside_title">Фильтровать</h2>
                    <div className="flights_filtersVariants">
                        {
                            [...new Set(flightsFromStore.reduce((acc:number[], flight) => {
                                return acc = [...acc, ...flight.flight.legs.map( leg => leg.segments.length-1 )]
                            }, [] ))].map(stop => { 
                                return (
                                    <div>
                                        <input type="checkbox" name="stops" id={'stop-' + stop} onChange={handleFilter('stops', String(stop))}/>
                                        <label htmlFor={'stop-' + stop}> - {!stop ? 'без пересадок' : stop + ' пересадка'}</label> {/* TODO: write a word parser to make the right ending of the word пересадка*/}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flights_prices"> {/* price */}
                    <h2 className="flights_aside_title">Цена</h2>
                    <div className="flights_pricesVariants">
                        <div className="flights_pricesVariant_from">
                            От <input type="text" name="minPrice" onChange={(e:ChangeEvent<HTMLInputElement>) => handleFilter('minPrice', e.target.value)(e)}/>
                        </div>
                        <div className="flights_pricesVariant_to">
                            До <input type="text" name="maxPrice" onChange={(e:ChangeEvent<HTMLInputElement>) => handleFilter('maxPrice', e.target.value)(e)}/>
                        </div>
                    </div>
                </div>
                <div className="flights_airlines"> {/* airlines */}
                    <h2 className="flights_aside_title">Авиакомпании</h2>
                    <ul className="flights_airlinesVariants">
                        {
                            listOfAirlines.map(airline => {
                                return <li className="flights_airlinesVariant"><input type="checkbox" name="carrier" onChange={handleFilter('carrier', airline.carrier.caption)}/>-<span className="flights_airlines_airlineName">{airline.carrier.caption}</span> <span className="flights_airlines_price">от {airline.price.amount.split('.')[0]} {airline.price.currency}</span></li>
                            })
                        }
                    </ul>
                </div>
            </aside>
            <div className="result"> {/* result */}
                <ul>
                    {   
                        getIntersection(Object.values(filtersApplied
                            .reduce((acc: { stops: Flight[], carrier: Flight[], minPrice:  Flight[], maxPrice: Flight[]}, filter) => {
                                // TODO: redo the trash below and redo getIntersection function. This is a temporary solution and will be fixed ASAP. 
                                if(filter.type === 'stops') { 
                                    return { ...acc, stops: [...acc.stops,...filterBy[filter.type](filter.value, flights)] }
                                } else if (filter.type === 'carrier') {
                                    return { ...acc, carrier: [...acc.carrier, ...filterBy[filter.type](filter.value, flights)] }
                                } else if (filter.type === 'minPrice') {
                                    return { ...acc, minPrice: [...filterBy[filter.type](filter.value, flights)] }
                                } else if (filter.type === 'maxPrice') {
                                    return { ...acc, maxPrice: [...filterBy[filter.type](filter.value, flights)] }
                                }
                                return acc
                            }, {stops: [], carrier: [], minPrice: flights, maxPrice: flights})))
                            .map(flight => {
                                return <FlightCard key={flight.flightToken} flightData={flight.flight}/>
                            })
                            .filter((flight, index) => {
                                return index < listSize
                            }) 
                    }
                </ul>
                <input type="button" className="flights_loadMore" value='показать еще' onClick={handleShowMore(4)}/>
            </div>
        </div>
    )
}
