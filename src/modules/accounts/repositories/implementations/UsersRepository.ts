import { Repository } from "typeorm";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";
import { AppDataSource } from '../../../../database/data-source';

class UsersRepository implements IUsersRepository {
	private repository: Repository<User>

	constructor() {
		this.repository = AppDataSource.getRepository(User);
	}

	async create({
		id,
		name,
		password,
		email,
		driver_license }
		: ICreateUserDTO): Promise<void> {
		const user = this.repository.create({
			id,
			name,
			password,
			email,
			driver_license
		});

		await this.repository.save(user);
	};

	async findByEmail(email: string): Promise<User> {
		const user = await this.repository.findOne({ where: { email } })
		return user;
	};

	async findById(id: string): Promise<User> {
		const user = await this.repository.findOne({ where: { id } })
		return user;
	}
}

export { UsersRepository };