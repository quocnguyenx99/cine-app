export interface User {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  uid: string;
}

export interface Item {
  adult?: boolean;
  backdrop_path: string;
  id: number;
  original_language: string;
  overview: string;
  poster_path: string;
  genre_ids?: number[];
  popularity: number;
  vote_average: number;
  vote_count: number;

  media_type: "tv" | "movie" | "person";

  // Movie Items
  title?: string;
  original_title?: string;
  release_date?: string;
  video: boolean;

  // TV Show Items
  name?: string;
  original_name?: string;
  origin_country?: string[];
  first_air_date?: string;

  // Person Items
  profile_path?: string;
}

export interface DetailFilmItem extends Item {
  genres: { id: number; name: string }[];
  homepage: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;

  // Movie
  belongs_to_collection?: null;
  budget?: number;
  imdb_id?: string;
  production_countries?: {
    iso_3166_1: string;
    name: string;
  }[];
  revenue?: number;
  runtime?: number;

  // TV Show
  created_by?: [];
  episode_run_time?: [];
  in_production?: true;
  languages?: string[];
  last_air_date?: string;
  last_episode_to_air?: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
  };
  next_episode_to_air?: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    runtime: number | null;
    season_number: number;
    show_id: number;
    still_path: string;
  };
  networks?: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  seasons?: [
    {
      air_date: string;
      episode_count: number;
      id: number;
      name: string;
      overview: string;
      poster_path: string;
      season_number: number;
      vote_average: number;
    }
  ];
  type?: string;
}

export interface GenreItemDetail {
  id: number;
  name: string;
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Review {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string;
    rating: number;
  };
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  crew: {
    department: string;
    job: string;
    credit_id: string;
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
  }[];
  guest_stars: {
    credit_id: string;
    order: number;
    character: string;
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
  }[];
}

export interface DetailSeason {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
}

export interface FilmInfo {
  detail?: DetailFilmItem | undefined;
  credits?: Cast[] | undefined;
  reviews?: Review[] | undefined;
  similar?: Item[] | undefined;
  videos?: Video[] | undefined;
}

export interface getWatchReturnType {
  detail?: DetailFilmItem | undefined;
  recommendations?: Item[] | undefined;
  detailSeasons?: DetailSeason[] | undefined;
}

// Type for async function return values
export interface HomeFilms {
  [key: string]: Item[];
}

export interface BannerInfo {
  genre: GenreItemDetail[];
  translation: string[];
}

export interface ItemsPage {
  page: number;
  results: Item[];
  total_results: number;
  total_pages: number;
}

export interface ConfigType {
  [key: string]: string | number;
}

export interface getRecommnedGenresType {
  movieGenres: GenreItemDetail[];
  tvGenres: GenreItemDetail[];
}
