export namespace Search {
  export interface BasePayload {
    type: 'movie' | 'series' | 'episode';
    y?: number; //year of release
    plot?: 'short' | 'full';
  }

  export namespace getMovies {
    export interface Payload extends BasePayload {
      s: string;
      page: number;
    }

    export interface Response {
      Search?: SearchEntity[] | null;
      totalResults: string;
      Response: string;
    }
    export interface SearchEntity {
      Title: string;
      Year: string;
      imdbID: string;
      Type: string;
      Poster: string;
    }
  }
}
