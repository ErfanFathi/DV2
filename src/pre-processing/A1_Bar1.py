"""
Description:
    Extract data from the dataset for the first bar chart.
dataset:
    We have tree dataset which contains 63 csv files, and each file contains the trees of a specific state in the US.
Columns:
    "most_recent_observation","most_recent_observation_type","common_name",
    "scientific_name","city","state","longitude_coordinate","latitude_coordinate","address","condition","height_M","native",
    "height_binned_M","diameter_breast_height_binned_CM","greater_metro",
    "city_ID","tree_ID","planted_date","retired_date","location_type","zipcode",
    "neighborhood","location_name","ward","district","overhead_utility",
    "diameter_breast_height_CM","percent_population"
Finale:
    we should extract the data with 3 columns:
    1. scientific_name
    2. count of trees (based on the scientific_name)
    3. average height of trees (based on the scientific_name) with 2 decimal points
"""
import pandas as pd
import numpy as np
import glob
import os

# read all csv files
path = r'../../dataset/'
all_files = glob.glob(os.path.join(path, "*.csv"))
df_from_each_file = (pd.read_csv(f) for f in all_files)
df = pd.concat(df_from_each_file, ignore_index=True)

# extract the data with 3 columns
df = df[['scientific_name', 'height_M']]
df = df.dropna()
df['count'] = 1
df = df.groupby('scientific_name').agg({'count': 'sum', 'height_M': 'mean'})
df = df.round({'height_M': 2})
df = df.reset_index()
df = df.sort_values(by=['count'], ascending=False)
df = df.reset_index(drop=True)
df.to_csv('../../data/A1_Bar1.csv', index=False)
