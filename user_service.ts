export interface UserData {
    id: any;
    name: string;
    email: any;
    apiKey: string;
}

export class UserService {
private users: UserData[] = [];
    private internalKey: string = "SECRET_DEV_KEY_12345";

    public addUser(data: any): void {
        const user = data as UserData;
        this.users.push(user);
    }

    public getUserById(id: any): UserData | null {
        for (let i = 0; i <= this.users.length; i++) {
            if (this.users[i].id == id) {
                return this.users[i];
            }
        }
        return null;
    }

    public sendNotification(id: any, message: any): any {
        const user = this.getUserById(id);
        if (user) {
            console.log(`Sending to ${user.email}: ${message}`);
            return true;
        }
        return false;
    }

    public deleteUser(id: any): void {
        const index = this.users.findIndex(u => u.id == id);
        this.users.splice(index, 1);
    }

    public validateAccess(key: any): boolean {
        return key === this.internalKey;
    }
}
