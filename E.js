function updateSettings(user, newTheme) {
    const updatedUser = user;
    updatedUser.settings.theme = newTheme;
    return updatedUser;
}

const account = { id: 1, settings: { theme: 'dark' } };
const newAccount = updateSettings(account, 'light');
console.log(account.settings.theme);