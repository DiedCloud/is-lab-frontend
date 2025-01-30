import {Venue} from './venue';
import {Event} from './event';

export interface Ticket{
  id? : number
  name: string
  coordinates: Coordinates
  creationDate: Date
  person: Person
  event: Event
  price: number
  type: TicketType
  discount: number
  number: number
  comment: string
  venue: Venue
  ownerId: number
}

export interface Coordinates{
  x: number
  y: number
}

export interface Person{
  eyeColor: Color
  hairColor: Color
  location: Location
  birthday: Date
  height: number
  width: number
}

export interface Location{
  x: number
  y: number
  z: number
}

export enum Color {BLUE,WHITE,BROWN}

export enum TicketType {VIP,USUAL,BUDGETARY}
