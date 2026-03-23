import os

def get_user_input():
    val = input("Enter a number: ")
    return val

def delete_temp_files():
    os.system("rm -rf /tmp/*")