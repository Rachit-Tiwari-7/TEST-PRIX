def add_to_inventory(item, inventory=None):
    if inventory is None:
        inventory = []
    inventory.append(item)
    return inventory
# Consider removing or commenting out these lines if they serve no purpose
# print(add_to_inventory("sword"))
# print(add_to_inventory("shield"))