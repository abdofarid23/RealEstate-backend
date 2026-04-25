import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(propertyData: any, userId: string) {
    const newProperty = this.propertiesRepository.create({
      ...propertyData,
      user: { id: userId },
    });
    return await this.propertiesRepository.save(newProperty);
  }

  async findAll(query: any) {
    const queryBuilder = this.propertiesRepository.createQueryBuilder('property')
      .leftJoinAndSelect('property.user', 'user');

    if (query.search) {
      queryBuilder.andWhere('property.title LIKE :search', { search: `%${query.search}%` });
    }
    if (query.minPrice) {
      queryBuilder.andWhere('property.price >= :minPrice', { minPrice: query.minPrice });
    }
    if (query.maxPrice) {
      queryBuilder.andWhere('property.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 12;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [properties, totalCount] = await queryBuilder.getManyAndCount();

    properties.forEach(prop => {
      if (prop.user) delete prop.user.password;
    });

    return {
      data: properties,
      meta: {
        totalItems: totalCount,
        itemCount: properties.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      }
    };
  }

  async findOne(id: string) {
    const property = await this.propertiesRepository.findOne({
      where: { id: id },
      relations: ['user']
    });
    if (!property) throw new NotFoundException('العقار ده مش موجود!');

    if (property.user) delete property.user.password;

    return property;
  }

  async update(id: string, updateData: any, userId: string) {
    const property = await this.findOne(id);

    if (property.user.id !== userId) {
      throw new ForbiddenException('عفواً، متقدرش تعدل عقار مش بتاعك!');
    }

    await this.propertiesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const property = await this.findOne(id);

    if (property.user.id !== userId) {
      throw new ForbiddenException('عفواً، متقدرش تمسح عقار مش بتاعك!');
    }

    await this.propertiesRepository.delete(id);
    return { message: 'تم مسح العقار بنجاح!' };
  }

  async uploadImage(id: string, imageUrl: string, userId: string) {
    const property = await this.findOne(id);

    if (property.user.id !== userId) {
      throw new ForbiddenException('عفواً، متقدرش ترفع صورة لعقار مش بتاعك!');
    }

    await this.propertiesRepository.update(id, { imageUrl: imageUrl });
    return { message: 'تم رفع الصورة بنجاح!', imageUrl: imageUrl };
  }

  // --- دوال المفضلة الجديدة ---
  async toggleFavorite(propertyId: string, userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    const property = await this.findOne(propertyId);

    const isFavorite = user.favorites.find((fav) => fav.id === propertyId);

    if (isFavorite) {
      user.favorites = user.favorites.filter((fav) => fav.id !== propertyId);
    } else {
      user.favorites.push(property);
    }

    await this.usersRepository.save(user);
    return {
      message: isFavorite ? 'تم الحذف من المفضلة' : 'تمت الإضافة للمفضلة',
      status: !isFavorite
    };
  }

  async getMyFavorites(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    return user.favorites;
  }
}