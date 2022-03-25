import axios from 'axios';

type DriverResult = {
    driverId: string,
    code: string,
    givenName: string,
    familyName: string,
    dateOfBirth: string,
    nationality: string,
    url: string,
}

const fetch = async () => {
    const client = axios.create({
        baseURL: 'http://ergast.com/api/f1',
    });

    const response = await client.get('/2022/drivers.json');
    const drivers = response.data.MRData.DriverTable.Drivers as [DriverResult];

    for (const driver of drivers) {
        const driverRequest = Object.assign({}, {
            id: driver.driverId,
            code: driver.code,
            name: driver.givenName + " " + driver.familyName,
            dob: driver.dateOfBirth,
            nationality: driver.nationality,
            url: driver.url.replace('http://', 'https://'),
        });

        await axios.post('http://localhost:8080/drivers', driverRequest)
    }
}

fetch()