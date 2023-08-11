import { User } from '../../db-types/User';

export async function getUser(userId: number, connection: any): Promise<User | undefined> {
    const userRepository = connection.getRepository(User);
    return await userRepository.findOne({
        where: { user_id: userId },
    });
}
