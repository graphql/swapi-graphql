export type ObjectWithId = DataResult & {
    id: number,
};

export type DataResult = {
    [key: string]: unknown,
    url: string,
    results: Record<string, unknown>[] & { next: string | null, url: string },
    next: string | null,
} | {
    url: string,
    [key: string]: unknown,
}


export type endPoints = 'people' | 'films' | 'planets' | 'species' | 'starships' | 'vehicles'

export type Urls = (`https://swapi.dev/api/${endPoints}/${number | `page?${number}`}/`) 
| `https://swapi.dev/api/${endPoints}/`


export type SwapiType = 'film' | 'person' | 'planet' | 'species' | 'starship' | 'vehicle'
