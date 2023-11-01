import os
import json

# Path to the dataset folder (../../dataset)
path = r'../../dataset/'
# Get all csv files in the dataset folder
all_files = os.listdir(path)
# Get the name of each city
cities = [file.split('_')[0] for file in all_files]
# Remove the duplicates
cities = list(dict.fromkeys(cities))
# Sort the cities alphabetically
cities.sort()

# dictionary to store the cities
data = {}
data['cities'] = cities

# write the cities in a json file
with open('../../utils/cities.json', 'w') as outfile:
    json.dump(data, outfile)
