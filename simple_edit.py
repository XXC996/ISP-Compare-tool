import json

# Read the JSON file
with open("src/data/ispData.json", "r") as f:
    data = json.load(f)

# Make a simple change to Telstra's pricing
data["providers"][0]["plans"]["25M"]["rrpPrice"] = 999
data["providers"][0]["plans"]["25M"]["discountPrice"] = 888

# Write the file back
with open("src/data/ispData_test.json", "w") as f:
    json.dump(data, f, indent=2)

print("Updated file saved to src/data/ispData_test.json") 