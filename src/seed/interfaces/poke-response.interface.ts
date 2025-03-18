export interface PokeResponse {
    count:    number;
    next:     string;
    previous: null;
    results:  PokemonsInterface[];
}

export interface PokemonsInterface {
    name: string;
    url:  string;
}
