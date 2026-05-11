/**
 * Global Type Definitions for the 2026 Ecosystem
 */
declare namespace Core {
    type ID = string | number;
    
    interface Tenant {
        id: ID;
        name: string;
        quota: number;
    }
ded::
    interface AuditLog {
        id: ID;
        actor: string;
        action: string;
        timestamp: string;
        meta: any;
    }
}

export type Result<T> = { success: true; data: T } | { success: false; error: Error };
