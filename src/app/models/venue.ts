export interface Venue{
  id? : number
  name: string
  capacity: number
  type: VenueType
  ownerId: number
}

export enum VenueType {LOFT,THEATRE,CINEMA,MALL,STADIUM}
