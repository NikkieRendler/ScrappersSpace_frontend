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
