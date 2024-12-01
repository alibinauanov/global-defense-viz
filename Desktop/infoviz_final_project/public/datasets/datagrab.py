import kaggle
import os

# You will need to create an account in kaggle, 
# and generate an API key, then you have to add the kaggle.json file in your home directory inside ./kaggle folder
download_path = os.path.dirname(os.path.abspath(__file__))

# Ensure the download path exists
os.makedirs(download_path, exist_ok=True)

# Download datasets to the specified path
datasets = [
    "nitinsss/military-expenditure-of-countries-19602019",
    "abhijitdahatonde/global-armed-forces-dataset",
    "justin2028/arms-imports-per-country",
    "prasertk/military-power-by-country-2022"
]

for dataset in datasets:
    try:
        kaggle.api.dataset_download_files(dataset, path=download_path, unzip=True)
        print(f"{dataset.split('/')[-1]} Dataset downloaded to: {download_path}")
    except Exception as e:
        print(f"Failed to download {dataset}: {e}")