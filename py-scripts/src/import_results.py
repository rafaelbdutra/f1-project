import sys
import json
import aiohttp
import asyncio
from functools import reduce
from commons import requests

async def main():
    if len(sys.argv) <= 1:
        print("Enter a year to import results from")
        sys.exit()

    with open("config.json", "r") as jsonfile:
        data = json.load(jsonfile)
        jsonfile.close()

    base_url = data.get("baseUrl")
    get_results_url = data.get("results").get("getPath")
    post_url = data.get("results").get("postUrl")

    year = sys.argv[1]
    full_url = base_url + get_results_url.replace("<year>", year)

    page = 0
    page_size = 30

    async with aiohttp.ClientSession() as session:

        while 1:
            offset = page * page_size
            page += 1

            results_url = f'{full_url}?offset={offset}'
            results = await fetch(session, results_url, page)

            if len(results) < 1:
                break

            imported_results = [await post_result(session, post_url, result) for result in results]
            print(f'Year: {year} | Imported {count_imported(imported_results)} for page {page}')


async def fetch(session, url, page):
    async with session.get(url) as response:

        if response.status != 200:
            raise RuntimeError(f'Failed to fetch race results for {year}')

        response_json = await response.json()
        return response_json.get("MRData").get("RaceTable").get("Races")


async def post_result(session, url, result):
    results_request = []
    for r in result.get("Results"):
        results_request.append({
            "driverId": r.get("Driver").get("driverId"),
            "constructorId": r.get("Constructor").get("constructorId"),
            "position": r.get("position"),
            "grid": r.get("grid"),
            "laps": r.get("laps"),
            "points": r.get("points"),
            "status": r.get("status"),
        })

    result_request = {
        "year": result.get("season"),
        "round": result.get("round"),
        "raceName": result.get("raceName"),
        "date": result.get("date"),
        "time": result.get("time"),
        "url": result.get("url"),
        "results": results_request,
    }

    async with session.post(url, data=json.dumps(result_request), headers=requests.headers) as response:
        if response.status != 200:
            raise RuntimeError(f'Failed to import races for year: {race_request.get("year")}. Response: {response.text}')

        imported_result = await response.json()

    return imported_result


def reduce_count_results(r1, r2):
    return len(r1.get("results")) + len(r2.get("results"))

def count_imported(imported_results):
    if len(imported_results) == 0:
        return 0
    if len(imported_results) == 1:
        return len(imported_results[0].get("results"))
    return reduce(reduce_count_results, imported_results)

asyncio.run(main())