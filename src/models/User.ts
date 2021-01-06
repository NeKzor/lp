import { ObjectId } from "./Model";

export class SocialLinks {
    discord?: string;
    twitch?: string;
    twitter?: string;
    youtube?: string;
}

export class UserSettings {
    display_name?: string;
    country_code?: string;
    social_links!: SocialLinks;
}

export type UserStatusType = 'Active' | 'Banned' | 'Inactive';

export class UserStatus {
    type!: UserStatusType;
}

export class UserPermission {
    bits!: number;
}

export class User {
    _id?: ObjectId;
    steam_id!: string;
    name?: string;
    avatar_url?: string;
    settings!: UserSettings;
    status!: UserStatus;
    permissions!: UserPermission;
    first_login!: string;
    last_login!: string;
    last_edit!: string;
}
