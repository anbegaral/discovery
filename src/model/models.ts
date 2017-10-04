export class Audioguide {
    $key: string;
    idAuthor: string;
    idLocation: string;
    title: string; 
    description: string;
    duration: number;
    pois: number;
    lang: string;
    price: number;
    image: string;
}

export class POI {
    $key: string;
    idAudioguide: string;
    title: string;
    lat: string;
    lon: string;
    image: string;
    file:string;
    duration: number;
}

export class User {
    $key: string;
    firstName?: string;
    lastName?: string
    address?: string;
    city?: string;
    postcode?: string;
    country?: string;
    bankaccount?: string;
    email: string;
    isAuthor: boolean;    
}

export class Country {
    // $key: string;
    // language: string[
    //     code: string; 
    //     name: string;
    // ]
}