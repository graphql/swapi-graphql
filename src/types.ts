export type ObjectWithId = DataResult & {
    id: number,
};

export type ResultItem = { next: string | null, url: string, [key: string]: unknown } | { properites: { next: string | null, url: string, [key: string]: unknown } }

export type DataResult = {
    url: string,
    results: Record<string, ResultItem>[],
    next: string | null,
} | {
    url: string,
    result: Record<string, ResultItem>[] ,
    next: string | null,
}


export type endPoints = 'people' | 'films' | 'planets' | 'species' | 'starships' | 'vehicles'

export type Urls = (`https://swapi.dev/api/${endPoints}/${number | `page?${number}`}/`) 
| `https://swapi.dev/api/${endPoints}/`


export type SwapiType = 'film' | 'person' | 'planet' | 'species' | 'starship' | 'vehicle'
