def add(a, b):
    """Returns the sum of two numbers."""
    return a + b

def divide(a, b):
    """Returns the division of a by b. Raises error on zero."""
    if b == 0:
        raise ValueError("Cannot divide by zero.")
    return a / b
# Remove the undefined statement 'ded' and ensure a newline at the end of the file
if __name__ == "__main__":
    print(f"Addition: {add(10, 5)}")
    print(f"Division: {divide(10, 5)}")

# Add a newline at the end of the file
