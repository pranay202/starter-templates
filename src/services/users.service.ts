import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { UserEntity } from '@/entities/users.entity';

class UserService {
  public users = UserEntity;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await this.users.findOneBy({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOneBy({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    if (userData.email) {
      const findUser: User = await this.users.findOneBy({ email: userData.email });
      if (findUser && findUser._id != userId) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updatedUser: User = await this.users
      .createQueryBuilder()
      .update(UserEntity)
      .set({ ...userData })
      .where('_id = :id', { id: userId })
      .returning('*')
      .execute()
      .then(res => res.raw[0]);

    if (!updatedUser) throw new HttpException(409, "User doesn't exist");

    return updatedUser;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deletedUser = await this.users
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where('_id = :id', { id: userId })
      .returning('*')
      .execute()
      .then(res => res.raw[0]);

    if (!deletedUser) throw new HttpException(409, "User doesn't exist");

    return deletedUser;
  }
}

export default UserService;
