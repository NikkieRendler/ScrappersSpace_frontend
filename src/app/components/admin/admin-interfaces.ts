export interface Resource {
    icon: string;
    link: string;
    resource: string;
    type: string;
    _id: string;
    contentAmount;
}

export interface CompanyData {
    name: string;
    logo: string;
    registrationCountry: string;
    companyType: string;
    motto: string;
    description: string;
    resources: Resource[];
}
