import { faker } from "@faker-js/faker";

export type data = {
    id: number;
    firstname: string;
    lastname: string
    gender: string;
    age: number;
    postcode: string;
    email: string;
}

export type nestedData = {
    id: number;
    firstname: string;
    lastname: string
    gender: string;
    age: number;
    postcode: string;
    email: string;
    children?: data[]
}

export const mockNormalData = (count: number): data[] => {
    const data: data[] = [];

    for (let i = 1; i <= count; i++) {
        data.push({
            id: i,
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            gender: faker.person.gender(),
            age: faker.number.int({ max: 100 }),
            postcode: faker.location.zipCode(),
            email: faker.internet.email()
        });
    }
    return data;
}

export const mockNestedData = (count: number): nestedData[] => {
    const nestedData: nestedData[] = [];
    const range = [0, 5];

    for (let i = 1; i <= count; i++) {
        const nesting = range[0] + Math.floor((Math.random() * (range[1] - range[0] + 1)))
        nestedData.push({
            id: i,
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            gender: faker.person.gender(),
            age: faker.number.int({ max: 100 }),
            postcode: faker.location.zipCode(),
            email: faker.internet.email(),
            children: Array(nesting).fill("*").map((_, index) => ({
                id: 65 + i + index,
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                gender: faker.person.gender(),
                age: faker.number.int({ max: 100 }),
                postcode: faker.location.zipCode(),
                email: faker.internet.email()
            }))
        })
    }
    return nestedData
}
