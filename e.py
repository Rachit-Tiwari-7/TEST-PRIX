def add_to_inventory(item, inventory=None):
    if inventory is None:
        inventory = []
    inventory.append(item)
    return inventory
# No change needed, the code is correct
print(add_to_inventory("shield"))
# Add a newline at the end of the file