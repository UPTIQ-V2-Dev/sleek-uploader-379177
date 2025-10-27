import { Role } from '../generated/prisma/index.js';

const allRoles = {
    [Role.USER]: ['manageOwnFiles'],
    [Role.ADMIN]: ['getUsers', 'manageUsers', 'manageOwnFiles']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
