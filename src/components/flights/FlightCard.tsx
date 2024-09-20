import React from "react";
import { FlightClass, Price, Segment } from "../../types/types";
import './flightCard.scss'

type FlightCardProps = {
    flightData: FlightClass
}

const months = ['янв.', 'фев.', 'мар.', 'апр.','мая','июн.','июл.','авг.','сен.','окт.','ноя.', 'дек.'];
const days   = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

export const FlightCard:React.FC<FlightCardProps> = (props) => {

    const getProperDate = (date:Date) => {
        let time = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        let day = date.getDate() + ' ' + months[date.getMonth()] + ' ' + days[date.getDay()-1];
        return {time, day}
    }

    return (
        <li className="FlightCard">
            <div className="FlightCard_top">
                <span className="FlightCard_top_totalPrice">{props.flightData.price.total.amount} {props.flightData.price.total.currency}</span>
                <span>Стоимость для одного взрослого пассажира</span>
            </div>
            <div className="flightCard_flightinfo">
                {props.flightData.legs.map(leg => {
                    const departure = leg.segments[0].departureCity.caption + ', '+ leg.segments[0].departureAirport.caption 
                    const arrival   = leg.segments[leg.segments.length-1].arrivalCity.caption + ', ' + leg.segments[leg.segments.length-1].arrivalAirport.caption 
                    
                    const departureDate = getProperDate(new Date(leg.segments[0].departureDate))
                    const arrivalDate   = getProperDate(new Date(leg.segments[leg.segments.length-1].arrivalDate))
                    const duration      = parseInt(String(leg.duration/60)) + ' ч ' + leg.duration%60 + ' мин'
                    const stops         = leg.segments.length - 1;

                    return (
                            <div className="flightCard_segmentinfo">
                                <div>
                                    {departure} <span className="colorDefaultBlue">({leg.segments[0].departureAirport.uid})</span> ------------{'>'} {arrival} <span className="colorDefaultBlue">({leg.segments[leg.segments.length-1].arrivalAirport.uid})</span> 
                                </div>
                                <div>
                                    <div className="flightCard_segmentinfo_timeInfo">
                                        <div>
                                            {departureDate.time} <span className="colorDefaultBlue">{departureDate.day}</span>
                                        </div>
                                        <div>
                                            {duration}
                                        </div>
                                        <div>
                                            <span className="colorDefaultBlue">{arrivalDate.day}</span> {arrivalDate.time}
                                        </div>
                                    </div>
                                    <div className="flightCard_stops">
                                        <span className="thinline"></span>
                                        {stops ? <div className="flightCard_stop">{stops} пересадка</div> : ''} {/*if we had more then 1 stop we also could parse the word 'пересадка' to make the proper word's ending*/}
                                        <span className="thinline"></span>
                                    </div>
                                </div>
                                <div>
                                    Рейс выполняет: {leg.segments[0].operatingAirline?.caption || props.flightData.carrier.caption}
                                </div>
                            </div>
                        )
                })}
            </div>
            <input className="flightCard_selectButton" type="button" value='ВЫБРАТЬ'/>
        </li>
    )
}
