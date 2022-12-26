import { Repository } from 'typeorm';
import { Category } from '../../entities/Category';
import { ICategoriesRepository, ICreateCategoryDTO } from '../ICategoriesRepository';
import { AppDataSource } from '../../../../database/data-source';

class CategoriesRepository implements ICategoriesRepository {

  // privado pois só quem tem acesso é o repositório
  private repository: Repository<Category>;

  constructor() {
    this.repository = AppDataSource.getRepository(Category);
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const category = this.repository.create({
      description,
      name,
    })

    await this.repository.save(category);

  };

  async list(): Promise<Category[]> {
    const categories = await this.repository.find();
    return categories;
  }

  async findByName(name: string): Promise<Category> {
    // select * from categories where name = "name" limit =1
    const category = await this.repository.findOne({ where: { name } })
    return category;
  }

}

export { CategoriesRepository };