#!/usr/bin/env python3
"""
ISP Price Update Script for the React ISP Comparison Website

This script reads prices from an Excel file and updates the ISP data JSON file.
It automatically detects providers in both the Excel file and JSON data, 
matching them using name patterns.

Usage:
  python3 update_prices.py [excel_file] [json_file]

If no arguments are provided, it will use default file paths.
"""

import pandas as pd
import json
import sys
import os
import copy
import re
from datetime import datetime

def log(message):
    """Simple logging function"""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

def main():
    # Get file paths from arguments or use defaults
    excel_file = sys.argv[1] if len(sys.argv) > 1 else "Price Comparison May 2025.xlsx"
    json_file = sys.argv[2] if len(sys.argv) > 2 else "src/data/ispData.json"
    
    if not os.path.exists(excel_file):
        log(f"Error: Excel file '{excel_file}' not found.")
        return 1
        
    if not os.path.exists(json_file):
        log(f"Error: JSON file '{json_file}' not found.")
        return 1
    
    # Create a backup of the JSON file
    backup_file = f"{json_file}.{datetime.now().strftime('%Y%m%d_%H%M%S')}.bak"
    try:
        with open(json_file, 'r') as src, open(backup_file, 'w') as dst:
            dst.write(src.read())
        log(f"Created backup at {backup_file}")
    except Exception as e:
        log(f"Warning: Could not create backup: {e}")
    
    # Read the Excel file
    try:
        log(f"Reading Excel file: {excel_file}")
        df = pd.read_excel(excel_file)
    except Exception as e:
        log(f"Error reading Excel file: {e}")
        return 1
    
    # Read the JSON file
    try:
        log(f"Reading JSON file: {json_file}")
        with open(json_file, "r") as f:
            isp_data = json.load(f)
    except Exception as e:
        log(f"Error reading JSON file: {e}")
        return 1
    
    # Make a deep copy for comparison
    original_data = copy.deepcopy(isp_data)
    
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
    # Find these automatically by looking for network names in the first column
    network_sections = {}
    for i in range(len(df)):
        cell_value = str(df.iloc[i, 0]).strip().lower() if pd.notna(df.iloc[i, 0]) else ""
        if cell_value == "nbn":
            network_sections["nbn"] = i
        elif "opticomm" in cell_value:
            network_sections["opticomm"] = i
        elif "redtrain" in cell_value:
            network_sections["redtrain"] = i
        elif "supa" in cell_value:
            network_sections["supa"] = i
    
    log(f"Found network sections: {', '.join(network_sections.keys())}")
    
    # Apply updates for each provider
    log("Updating provider prices...")
    
    for provider in isp_data["providers"]:
        provider_name = provider["name"].upper()
        provider_id = provider["id"]
        log(f"Processing provider: {provider_name} ({provider_id})")
        
        # Skip if provider has no plans (safeguard)
        if not provider.get("plans"):
            log(f"  Skipping: No plans found for {provider_name}")
            continue
        
        # Loop through each speed tier and update prices
        for speed_key, excel_speed in speed_tiers.items():
            # Skip if plan doesn't exist for provider
            if speed_key not in provider["plans"]:
                continue
                
            log(f"  Speed tier: {speed_key} (Excel: {excel_speed})")
            
            # Loop through each network type the provider supports
            for network_type, supported in provider["networkTypes"].items():
                if not supported or network_type not in network_sections:
                    continue
                    
                start_row = network_sections[network_type]
                
                # Find column index for this speed tier
                speed_col = None
                for col in range(1, df.shape[1]):
                    if col < df.shape[1] and pd.notna(df.iloc[start_row, col]) and str(df.iloc[start_row, col]).strip() == excel_speed:
                        speed_col = col
                        break
                
                if speed_col is None:
                    log(f"    Speed tier {excel_speed} not found in {network_type}")
                    continue
                    
                # Check if this provider has pricing in min price or max price rows
                min_price_isp_row = start_row + 1
                max_price_isp_row = start_row + 3
                occom_price_row = start_row + 5  # Special row for OCCOM
                
                # Find price for this provider
                price = None
                
                # Special case for OCCOM which has its own dedicated row
                if provider_name == "OCCOM":
                    if occom_price_row < df.shape[0] and speed_col < df.shape[1] and pd.notna(df.iloc[occom_price_row, speed_col]):
                        price = df.iloc[occom_price_row, speed_col]
                        log(f"    Found OCCOM price in dedicated row: {price}")
                else:
                    # Case-insensitive match of provider names
                    # Check if provider is in min price row
                    if min_price_isp_row < df.shape[0] and speed_col < df.shape[1] and pd.notna(df.iloc[min_price_isp_row, speed_col]):
                        excel_provider = str(df.iloc[min_price_isp_row, speed_col]).strip().upper()
                        if excel_provider == provider_name or provider_name in excel_provider or excel_provider in provider_name:
                            price_row = min_price_isp_row + 1
                            if price_row < df.shape[0] and pd.notna(df.iloc[price_row, speed_col]):
                                price = df.iloc[price_row, speed_col]
                                log(f"    Found as min price ISP: {price}")
                    
                    # Check if provider is in max price row
                    if price is None and max_price_isp_row < df.shape[0] and speed_col < df.shape[1] and pd.notna(df.iloc[max_price_isp_row, speed_col]):
                        excel_provider = str(df.iloc[max_price_isp_row, speed_col]).strip().upper()
                        if excel_provider == provider_name or provider_name in excel_provider or excel_provider in provider_name:
                            price_row = max_price_isp_row + 1
                            if price_row < df.shape[0] and pd.notna(df.iloc[price_row, speed_col]):
                                price = df.iloc[price_row, speed_col]
                                log(f"    Found as max price ISP: {price}")
                
                # Update provider price if found
                if price is not None and str(price) != "-":
                    old_rrp = provider["plans"][speed_key]["rrpPrice"]
                    old_discount = provider["plans"][speed_key]["discountPrice"]
                    
                    # Only update if different
                    if float(price) != float(old_rrp) if isinstance(old_rrp, (int, float)) else price != old_rrp:
                        provider["plans"][speed_key]["rrpPrice"] = price
                        log(f"    Updated RRP price: {old_rrp} → {price}")
                    
                    # For discount price, keep it the same percentage off if it was discounted before
                    if old_discount != old_rrp:
                        discount_ratio = float(old_discount) / float(old_rrp) if isinstance(old_rrp, (int, float)) and isinstance(old_discount, (int, float)) else 1
                        discount_price = round(float(price) * discount_ratio, 2)
                        provider["plans"][speed_key]["discountPrice"] = discount_price
                        log(f"    Updated discount price: {old_discount} → {discount_price}")
                    else:
                        provider["plans"][speed_key]["discountPrice"] = price
    
    # Save the updated data
    output_file = json_file
    with open(output_file, "w") as f:
        json.dump(isp_data, f, indent=2)
    
    log(f"Updated ISP data saved to {output_file}")
    
    # Show a detailed comparison of what changed
    log("\n=== DETAILED COMPARISON OF CHANGES ===")
    changes_found = False
    
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
                changes_found = True
                changes.append(f"  {speed_key}: ${old_rrp}/${old_discount} → ${new_rrp}/${new_discount} (RRP/Discount)")
        
        if found_changes:
            print(f"{provider_name} ({provider_id}) plan changes:")
            for change in changes:
                print(change)
            print()
    
    if not changes_found:
        log("No price changes were found or applied.")
    
    log("=== UPDATE COMPLETE ===")
    return 0

if __name__ == "__main__":
    sys.exit(main()) 