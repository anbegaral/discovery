import { File } from '@ionic-native/file';
export class Audioguide {
    key: string;
    idAuthor: string;
    idLocation: string;
    title: string; 
    description: string;
    duration: number;
    pois: number;
    lang: string;
    price: number;
    image: string;
    imageUrl: string;
    reviewed: boolean;
    size: number;
    audioguidePois: POI[];
}

export class POI {
    key: string;
    idFirebase: string;
    idAudioguide: string;
    title: string;
    lat: string;
    lon: string;
    isPreview: boolean;
    image: string;
    imageUrl: string;
    file: string;
    duration: string;
}

export class User {
    key: string;
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
    key: string;
    language: [
        {
            code: string; 
            name: string;
        }
    ]
}

export class Location {
    key: string;
    idCountry: string;
    language: [
        {
            code: string; 
            name: string;
        }
    ];
    locationName: string;
    numberOfAudioguides: number;
    countryName: string;
}

export class Upload {
    $key: string;
    file: File;
    image: string;
    imageUrl: string;
    progress: number;
    
    constructor(file:File) {
        this.file = file
    }
}