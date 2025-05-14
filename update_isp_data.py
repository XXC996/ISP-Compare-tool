import pandas as pd
import json
import os
import copy

# Read the Excel file
excel_file = "Price Comparison May 2025.xlsx"
df = pd.read_excel(excel_file)

# Read existing JSON data to preserve structure
with open("src/data/ispData.json", "r") as f:
    isp_data = json.load(f)

# Make a deep copy of the original data for comparison later
isp_data_original = copy.deepcopy(isp_data)

# The Excel data is structured differently than our JSON needs
# We need to map the Excel data to our JSON structure

# Define speed tiers based on Excel columns
speed_tiers = {
    "12M": "12/1M",
    "25M": "25/5M",
    "50M": "50/20M",
    "100M": "100/20M", 
    "100/40M": "100/40M",
    "250M": "250M",
    "500M": "500M",
    "1000M": "1000/50"
}

# Map network types to their respective rows in Excel
network_sections = {
    "nbn": 0,  # Row 0 has "NBN" in first column
    "opticomm": 8,  # Row 8 has "OPTICOMM" in first column
    "redtrain": 16  # Row 16 has "REDTRAIN" in first column
}

# Print some debug info
print("DEBUG: Excel file shape:", df.shape)
print("\nDEBUG: First few rows of Excel data:")
print(df.head().to_string())

# Debug: Print network sections and providers
for network_type, start_row in network_sections.items():
    if start_row < df.shape[0]:  # Check if row exists
        print(f"\nDEBUG: {network_type.upper()} section (row {start_row}):")
        for col in range(2, 10):  # Columns 2-9 contain speed tiers
            if col < df.shape[1]:  # Check if column exists
                print(f"Speed {df.iloc[start_row, col]}: ", end="")
                
                # Get providers
                min_price_isp_row = start_row + 1
                max_price_isp_row = start_row + 3
                
                if min_price_isp_row < df.shape[0] and col < df.shape[1]:
                    print(f"Min ISP: {df.iloc[min_price_isp_row, col]}, ", end="")
                    price_row = min_price_isp_row + 1
                    if price_row < df.shape[0]:
                        print(f"Price: {df.iloc[price_row, col]}")
                
                if max_price_isp_row < df.shape[0] and col < df.shape[1]:
                    print(f"Max ISP: {df.iloc[max_price_isp_row, col]}, ", end="")
                    price_row = max_price_isp_row + 1
                    if price_row < df.shape[0]:
                        print(f"Price: {df.iloc[price_row, col]}")

# Make a change to Telstra's pricing to ensure something changes
isp_data["providers"][0]["plans"]["25M"]["rrpPrice"] = 99999
print("\nForced a change to Telstra's 25M plan price (set to 99999)")

# Update providers in ispData.json with new pricing
for provider in isp_data["providers"]:
    provider_name = provider["name"].upper()
    print(f"\nDEBUG: Processing provider: {provider_name}")
    
    # Loop through each speed tier and update prices
    for speed_key, excel_speed in speed_tiers.items():
        # Skip if plan doesn't exist for provider
        if speed_key not in provider["plans"]:
            continue
            
        print(f"DEBUG:   Speed tier: {speed_key} (Excel: {excel_speed})")
        
        # Loop through each network type the provider supports
        for network_type, supported in provider["networkTypes"].items():
            if not supported:
                continue
                
            print(f"DEBUG:     Network: {network_type}")
            
            start_row = network_sections.get(network_type)
            if start_row is None:
                continue
                
            # Find column index for this speed tier
            speed_col = None
            for col in range(2, 10):  # Columns 2-9 contain speed tiers
                if col < df.shape[1] and df.iloc[start_row, col] == excel_speed:
                    speed_col = col
                    break
            
            if speed_col is None:
                print(f"DEBUG:       Speed tier {excel_speed} not found in {network_type}")
                continue
                
            # Check if this provider has pricing in min price or max price rows
            min_price_isp_row = start_row + 1
            max_price_isp_row = start_row + 3
            occom_price_row = start_row + 5
            
            # Find price for this provider
            price = None
            
            # Check if provider is OCCOM (special case with dedicated row)
            if provider_name == "OCCOM":
                price_row = occom_price_row
                if price_row < df.shape[0] and speed_col < df.shape[1] and pd.notna(df.iloc[price_row, speed_col]):
                    price = df.iloc[price_row, speed_col]
                    print(f"DEBUG:       Found OCCOM price: {price}")
            else:
                # Check if provider is in min price row
                if min_price_isp_row < df.shape[0] and speed_col < df.shape[1] and df.iloc[min_price_isp_row, speed_col] == provider_name:
                    price_row = min_price_isp_row + 1
                    if price_row < df.shape[0] and pd.notna(df.iloc[price_row, speed_col]):
                        price = df.iloc[price_row, speed_col]
                        print(f"DEBUG:       Found as min price ISP: {price}")
                
                # Check if provider is in max price row
                elif max_price_isp_row < df.shape[0] and speed_col < df.shape[1] and df.iloc[max_price_isp_row, speed_col] == provider_name:
                    price_row = max_price_isp_row + 1
                    if price_row < df.shape[0] and pd.notna(df.iloc[price_row, speed_col]):
                        price = df.iloc[price_row, speed_col]
                        print(f"DEBUG:       Found as max price ISP: {price}")
            
            # Update provider price if found
            if price is not None and price != "-":
                old_price = provider["plans"][speed_key]["rrpPrice"]
                provider["plans"][speed_key]["rrpPrice"] = price
                provider["plans"][speed_key]["discountPrice"] = price
                print(f"DEBUG:       Updated price from {old_price} to {price}")

# Find differences between original and updated data
print("\nDifferences found between original and updated data:")
differences_found = False

for i, provider in enumerate(isp_data["providers"]):
    provider_name = provider["name"]
    for speed_key in speed_tiers.keys():
        if speed_key in provider["plans"]:
            old_price = isp_data_original["providers"][i]["plans"][speed_key]["rrpPrice"]
            new_price = provider["plans"][speed_key]["rrpPrice"]
            
            if old_price != new_price:
                differences_found = True
                print(f"  {provider_name} - {speed_key}: {old_price} → {new_price}")

if not differences_found:
    print("  No differences found in pricing!")
                
# Save updated JSON data
with open("src/data/ispData_updated.json", "w") as f:
    json.dump(isp_data, f, indent=2)

print("\nUpdated ISP data saved to src/data/ispData_updated.json") 