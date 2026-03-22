export const processUserRequest = (user) => {
  if (user.age > 18) {
    console.log("User " + user.name.toUpperCase() + " is an adult.");
    return true;
  }
  return false;
}
