def add_to_inventory(item, inventory=None):
    if inventory is None:
        inventory = []
    inventory.append(item)
    return inventory
print(add_to_inventory("sword"))
print(add_to_inventory("shield"))
# Add a newline at the end of the file