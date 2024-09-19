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
        duration:  () => []
    }
    
    const sortBy:sortTypes = {
        lowPrice:  () => flights.slice().sort((a,b) => Number(a.flight.price.total.amount) - Number(b.flight.price.total.amount)),
        highPrice: () => flights.slice().sort((a,b) => Number(b.flight.price.total.amount) - Number(a.flight.price.total.amount)),
        duration:  () => [] // TODO: sort by duration
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
                setFiltersApplied([...filtersApplied].filter(filter => filter.type !== filterType))
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

    return (
        <div className="flights">
            <aside>
                <div> {/* sort */}
                    <input type="radio" name="sort" id="lowPrice" onChange={handleSort('lowPrice')}/>
                    <label htmlFor="lowPrice"> - по возрастанию цены</label>
                    <input type="radio" name="sort" id="highPrice" onChange={handleSort('highPrice')}/>
                    <label htmlFor="highPrice"> - по убыванию цене</label>
                </div>
                <div> {/* filter */}
                    <input type="checkbox" name="stops" id="stops-0" onChange={handleFilter('stops', '0')}/>
                    <label htmlFor="stops-0"> - без пересадок</label>
                    <input type="checkbox" name="stops" id="stops-1" onChange={handleFilter('stops', '1')}/>
                    <label htmlFor="stops-1"> - 1 пересадка</label>
                </div>
                <div> {/* price */}
                    От<input type="text" name="minPrice" onChange={(e:ChangeEvent<HTMLInputElement>) => handleFilter('minPrice', e.target.value)(e)}/>
                    До<input type="text" name="maxPrice" onChange={(e:ChangeEvent<HTMLInputElement>) => handleFilter('maxPrice', e.target.value)(e)}/>
                </div>
                <div> {/* airlines */}
                    <ul>
                        {
                            listOfAirlines.map(airline => {
                                return <li><input type="checkbox" name="carrier" onChange={handleFilter('carrier', airline.carrier.caption)}/>-<span>{airline.carrier.caption}</span> от {airline.price.amount.split('.')[0]} {airline.price.currency}</li>
                            })
                        }
                    </ul>
                </div>
            </aside>
            <div className="result"> {/* result */}
                <ul>
                    {
                        filtersApplied
                            .reduce((acc, filter) => {
                                return acc = filterBy[filter.type](filter.value, acc)
                            }, flights)
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
