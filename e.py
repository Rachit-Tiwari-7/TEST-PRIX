def add_to_inventory(item, inventory=[]):
    inventory.append(item)
    return inventory

print(add_to_inventory("sword"))
print(add_to_inventory("shield"))