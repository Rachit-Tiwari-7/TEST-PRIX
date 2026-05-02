function updateSettings(user, newTheme) {
    const updatedUser = { ...user }; // Create a shallow copy of the user object
    updatedUser.settings = { ...updatedUser.settings }; // Create a shallow copy of the settings object
    updatedUser.settings.theme = newTheme;
    return updatedUser;
}