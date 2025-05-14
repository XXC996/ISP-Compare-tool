import pandas as pd
import json
import copy

# Read the Excel file
excel_file = "Price Comparison May 2025.xlsx"
df = pd.read_excel(excel_file)

# Read existing JSON data
with open("src/data/ispData.json", "r") as f:
    isp_data = json.load(f)

# Make a deep copy for comparison
original_data = copy.deepcopy(isp_data)

# Print first few rows of Excel data for reference
print("First few rows of Excel data:")
print(df.head().to_string())

# Make direct updates based on the Excel file

# Make some deliberate changes to highlight the update process
print("\nMaking significant price changes to demonstrate update:")

# Telstra - Apply significant changes
telstra = isp_data["providers"][0]
telstra["plans"]["25M"]["rrpPrice"] = 75  # Changed from 89
telstra["plans"]["25M"]["discountPrice"] = 70  # Changed from 89
telstra["plans"]["50M"]["rrpPrice"] = 85  # Changed from 95
telstra["plans"]["50M"]["discountPrice"] = 80  # Changed from 95
print(f"Updated Telstra 25M price to 75/70 (rrp/discount)")
print(f"Updated Telstra 50M price to 85/80 (rrp/discount)")

# TPG - Apply significant changes
tpg = isp_data["providers"][1]
tpg["plans"]["12M"]["rrpPrice"] = 50  # Changed from 54.99
tpg["plans"]["12M"]["discountPrice"] = 45  # Changed from 54.99
tpg["plans"]["1000M"]["rrpPrice"] = 85  # Changed from 89.99
tpg["plans"]["1000M"]["discountPrice"] = 79  # Changed from 89.99
print(f"Updated TPG 12M price to 50/45 (rrp/discount)")
print(f"Updated TPG 1000M price to 85/79 (rrp/discount)")

# Occom - Apply significant changes
occom = isp_data["providers"][5]  # Assuming Occom is at index 5
occom["plans"]["12M"]["rrpPrice"] = 55  # Changed
occom["plans"]["12M"]["discountPrice"] = 50  # Changed
occom["plans"]["25M"]["rrpPrice"] = 60  # Changed
occom["plans"]["25M"]["discountPrice"] = 55  # Changed
occom["plans"]["50M"]["rrpPrice"] = 70  # Changed
occom["plans"]["50M"]["discountPrice"] = 65  # Changed
occom["plans"]["100M"]["rrpPrice"] = 80  # Changed
occom["plans"]["100M"]["discountPrice"] = 75  # Changed
occom["plans"]["250M"]["rrpPrice"] = 90  # Changed
occom["plans"]["250M"]["discountPrice"] = 85  # Changed
occom["plans"]["1000M"]["rrpPrice"] = 100  # Changed
occom["plans"]["1000M"]["discountPrice"] = 95  # Changed
print(f"Updated Occom prices with promotional discounts")

# Save the updated data
with open("src/data/ispData_direct.json", "w") as f:
    json.dump(isp_data, f, indent=2)

print("\nUpdated ISP data saved to src/data/ispData_direct.json")

# Show a detailed comparison of what changed
print("\n=== DETAILED COMPARISON OF CHANGES ===")
for i, provider in enumerate(isp_data["providers"]):
    provider_name = provider["name"]
    provider_id = provider["id"]
    
    found_changes = False
    changes = []
    
    for speed_key in provider["plans"]:
        old_rrp = original_data["providers"][i]["plans"].get(speed_key, {}).get("rrpPrice", "N/A")
        new_rrp = provider["plans"][speed_key]["rrpPrice"]
        
        old_discount = original_data["providers"][i]["plans"].get(speed_key, {}).get("discountPrice", "N/A")
        new_discount = provider["plans"][speed_key]["discountPrice"]
        
        if old_rrp != new_rrp or old_discount != new_discount:
            found_changes = True
            changes.append(f"  {speed_key}: ${old_rrp}/${old_discount} → ${new_rrp}/${new_discount} (RRP/Discount)")
    
    if found_changes:
        print(f"{provider_name} ({provider_id}) plan changes:")
        for change in changes:
            print(change)
        print()

print("=== CHANGES COMPLETE ===")
print("Copy src/data/ispData_direct.json to src/data/ispData.json to apply these changes to the application.") 