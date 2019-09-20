export interface CompanyDataToDisplay {
    name: string;
    logo: string;
    registrationCountry: string;
    companyType: string;
    motto: string;
    description: string;
    resources: ResourceTypes;
}

export interface CompanyDataToAdd {
    name: string;
    logo: string;
    registrationCountry: string;
    companyType: string;
    motto: string;
    description: string;
    resources: Resource[];
}

export interface CompanyWithLocation {
    name: string;
    address: Address[];
    resources: LocationResource[];
}

export interface Address {
    city: string;
    lat: number;
    lng: number;
    street: string;
}

export interface LocationResource {
    link: string;
}

export interface ResourceTypes {
    ownWebsite?: Resource[];
    socialNetwork?: Resource[];
    info?: Resource[];
    reviews?: Resource[];
}
export interface Resource {
    icon: string;
    link: string;
    resource: string;
    type: string;
    _id: string;
    contentAmount;
}
