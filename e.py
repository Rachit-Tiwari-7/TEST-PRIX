def add_to_inventory(item, inventory=None):
    if inventory is None:
        inventory = []
    inventory.append(item)
    return inventory
def add_to_inventory(item, inventory=None):
    if inventory is None:
        inventory = []
    inventory.append(item)
    return inventory

if __name__ == "__main__":
    print(add_to_inventory("sword"))
    print(add_to_inventory("shield"))