import { Film } from "./schema/types/film.js";
import { Person } from "./schema/types/person.js";
import { Planet } from "./schema/types/planet.js";
import { Species } from "./schema/types/species.js";
import { Starship } from "./schema/types/starship.js";
import { Vehicle } from "./schema/types/vehicle.js";




export type SwapiObject = Film | Person | Planet | Species | Starship | Vehicle

export type NormalResultItem = { next: string | null, url: string } & SwapiObject

export type ResultItem = NormalResultItem  | { properties: NormalResultItem }

export type DataResult = {
    url: string,
    results: Record<string, ResultItem>[],
    next: string | null,
} | {
    url: string,
    result: Record<string, ResultItem>[] ,
    next: string | null,
}

export type ObjectWithId = DataResult & {
    id: number,
};

export type endPoints = 'people' | 'films' | 'planets' | 'species' | 'starships' | 'vehicles'

export type Urls = (`https://swapi.dev/api/${endPoints}/${number | `page?${number}`}/`) 
| `https://swapi.dev/api/${endPoints}/`


export type SwapiType = 'film' | 'person' | 'planet' | 'species' | 'starship' | 'vehicle'
