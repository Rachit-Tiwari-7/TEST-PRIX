def add_to_inventory(item, inventory=None):
    if inventory is None:
        inventory = []
    inventory.append(item)
    return inventory
# Add a newline at the end of the file
    print(add_to_inventory("sword"))
    print(add_to_inventory("shield"))