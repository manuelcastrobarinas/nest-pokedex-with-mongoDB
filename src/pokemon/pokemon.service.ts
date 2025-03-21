import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0} = paginationDto; 
    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({ //ordena la columna no de menera ascendente
      no: 1
    })
    .select('-__v') //le decimos que quite de la respuesta la columna -__v
  }

  async findOne(term: string) {
    let pokemon:Pokemon | null = null;
    
    if(!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no:term});
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()});
    }

    if (!pokemon) throw new NotFoundException(`Pokemon not found`);
    return pokemon;
    
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {   
      const pokemon:Pokemon = await this.findOne(term);
      if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      
      await pokemon.updateOne(updatePokemonDto, {new: true});
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({_id:id});
    if (deletedCount === 0) throw new BadRequestException(`Pokemon with id ${id} not found`);
    return;
  }

  private handleException(error:any) {
    if (error.code === 11000) throw new BadRequestException(`pokemon value dupliqued in db ${JSON.stringify(error.keyValue)}`);
    console.log(error);
    throw new InternalServerErrorException(`Can't update pokemon - check server logs`)
  }
}
