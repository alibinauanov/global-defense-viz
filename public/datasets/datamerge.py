import pandas as pd
import os

def merge_datasets(df1, df2, on, how='inner'):
    """
    Merge two datasets on a specified column.

    Parameters:
    df1 (pd.DataFrame): The first dataframe.
    df2 (pd.DataFrame): The second dataframe.
    on (str): The column name to merge on.
    how (str): The type of merge to be performed. Default is 'inner'.

    Returns:
    pd.DataFrame: The merged dataframe.
    """
    merged_df = pd.merge(df1, df2, on=on, how=how)
    return merged_df



# Get the absolute path based on the script's location
datasets_path = os.path.dirname(os.path.abspath(__file__))


# List of dataset filenames
dataset_files = [
    "military.csv",
    "Military Expenditure.csv",
    "Arms Imports Per Country (1950-2020).csv",
    "global firepower 2022 wide.csv"
]

# Read and merge datasets
dataframes = []
for file in dataset_files:
    file_path = os.path.join(datasets_path, file)

    print(f"Checking file: {file_path}")  # Debug statement
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        dataframes.append(df)
        print(f"Loaded file: {file_path}")  # Debug statement
    else:
        print(f"File not found: {file_path}")

# Merge all dataframes on a common column (e.g., 'Country')
# Adjust the 'on' parameter based on the common column in your datasets
merged_df = dataframes[0]
for df in dataframes[1:]:
    merged_df = merge_datasets(merged_df, df, on='Country', how='outer')

# Save the merged dataset to a new file
merged_file_path = os.path.join(datasets_path, "merged_dataset.csv")
merged_df.to_csv(merged_file_path, index=False)

print(f"Merged dataset saved to: {merged_file_path}")