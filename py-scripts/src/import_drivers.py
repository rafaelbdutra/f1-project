import json
import aiohttp
import asyncio

headers = {
    "Content-Type": "application/json"
}


async def main():
    with open("config.json", "r") as jsonfile:
        data = json.load(jsonfile)
        jsonfile.close()

    base_url = data.get("baseUrl")
    get_drivers_url = data.get("drivers").get("getPath")
    post_drivers_url = data.get("drivers").get("postUrl")

    page = 0
    page_size = 30

    async with aiohttp.ClientSession() as session:

        while 1:
            page += 1
            offset = page * page_size

            drivers_url = f'{base_url}{get_drivers_url}?offset={offset}'
            drivers = await fetch(session, drivers_url, page)

            if len(drivers) < 1:
                break

            imported_drivers = [(await post_driver(session, post_drivers_url, driver), driver) for driver in drivers]
            print(f'Imported {len(imported_drivers)} drivers for page {page}')


async def fetch(session, url, page):
    async with session.get(url) as response:

        if response.status != 200:
            raise RuntimeError(f'Failed to fetch drivers for page {page}')

        response_json = await response.json()
        return response_json.get("MRData").get("DriverTable").get("Drivers")


async def post_driver(session, url, driver):
    driver_request = {
        "id": driver.get("driverId"),
        "code": driver.get("code"),
        "name": f'{driver.get("givenName")} {driver.get("familyName")}',
        "dob": driver.get("dateOfBirth"),
        "nationality": driver.get("nationality"),
        "url": driver.get("url").replace("http://", "https://"),
    }

    async with session.post(url, data=json.dumps(driver_request), headers=headers) as response:
        if response.status != 200:
            raise RuntimeError(f'Failed to import driver: {driver_request}. Response: {response.text}')

        imported_driver = await response.json()

    return imported_driver


asyncio.run(main())
