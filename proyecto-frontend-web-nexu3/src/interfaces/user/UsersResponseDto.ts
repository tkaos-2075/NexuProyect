export interface UsersResponseDto {
	id: number;
	email: string;
	name: string;
	status: UserStatus;
	role?: UserRole;
}

export type UserRole = 'USER' | 'ADMIN' | 'VIEWER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETE';