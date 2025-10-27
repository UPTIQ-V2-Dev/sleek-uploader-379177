import { userService } from '../services/index.ts';
import ApiError from '../utils/ApiError.ts';
import catchAsyncWithAuth from '../utils/catchAsyncWithAuth.ts';
import pick from '../utils/pick.ts';
import httpStatus from 'http-status';

const createUser = catchAsyncWithAuth(async (req, res) => {
    const { email, password, name, role } = req.body;
    const user = await userService.createUser(email, password, name, role);
    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(httpStatus.CREATED).send(userWithoutPassword);
});

const getUsers = catchAsyncWithAuth(async (req, res) => {
    const filter = pick(req.validatedQuery, ['name', 'role']);
    const options = pick(req.validatedQuery, ['sortBy', 'limit', 'page']);
    const result = await userService.queryUsers(filter, options, [
        'id',
        'email',
        'name',
        'role',
        'isEmailVerified',
        'createdAt',
        'updatedAt'
    ]);
    res.send(result);
});

const getUser = catchAsyncWithAuth(async (req, res) => {
    const user = await userService.getUserById(parseInt(req.params.userId), [
        'id',
        'email',
        'name',
        'role',
        'isEmailVerified',
        'createdAt',
        'updatedAt'
    ]);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
});

const updateUser = catchAsyncWithAuth(async (req, res) => {
    const user = await userService.updateUserById(parseInt(req.params.userId), req.body, [
        'id',
        'email',
        'name',
        'role',
        'isEmailVerified',
        'createdAt',
        'updatedAt'
    ]);
    res.send(user);
});

const deleteUser = catchAsyncWithAuth(async (req, res) => {
    await userService.deleteUserById(parseInt(req.params.userId));
    res.send({ message: 'User deleted successfully' });
});

export default {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};
