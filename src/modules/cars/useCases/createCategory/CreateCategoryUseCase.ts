import { AppError } from "../../../../errors/AppError";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

interface IRequest {
  name: string,
  description: string,
}


class CreateCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) { }

  async execute({ name, description }: IRequest): Promise<void> {

    const categoryAlreadyExixts = await this.categoriesRepository.findByName(name);

    if (categoryAlreadyExixts) {
      throw new AppError("Category already exists!");
    }

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };