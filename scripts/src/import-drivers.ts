import axios from 'axios';
import * as config from './config.json';

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
        baseURL: config.baseUrl,
    });

    console.log(`##### Fetching drivers from ${config.baseUrl + config.drivers.getPath} ####`);

    let page = 0;
    const pageSize = 30;

    while (true) {
        const offset = page++ * pageSize;

        const response = await client.get(`${config.drivers.getPath}?offset=${offset}`);
        if (response.status !== 200) {
            throw new Error(`Failed to fetch drivers for page ${page}`)
        }

        const drivers = response.data.MRData.DriverTable.Drivers as [DriverResult];
        if (drivers.length < 1) {
            break;
        }

        await Promise.all(drivers.map(driver => postDriver(driver)))
        console.log(`Imported ${drivers.length} drivers for page ${page}`);
    }
}

const postDriver = async (driver: DriverResult) => {
    const driverRequest = Object.assign({}, {
        id: driver.driverId,
        code: driver.code,
        name: driver.givenName + " " + driver.familyName,
        dob: driver.dateOfBirth,
        nationality: driver.nationality,
        url: driver.url.replace('http://', 'https://'),
    });

    return axios.post(config.drivers.postUrl, driverRequest, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

fetch().then(_ => console.log(`Import finished successfully`))