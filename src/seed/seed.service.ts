import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';


@Injectable()
export class SeedService {
  
  private readonly axios:AxiosInstance = axios;
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); //delete * from pokemons;
    const {data , ...response } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    
    //FORMA DE INSERCION MAS OPTIMA

    const pokemonToInsert: { name:string, no:number }[] = []; //Creamos un arreglo con la estructura name 
    data.results.forEach(({name, url}) => {
      const segments = url.split('/'); //dividir la url apartir del / devuelve un arreglo
      const no = +segments[segments.length - 2];
      
      pokemonToInsert.push({name, no});
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    //ESTA INSERCION ES MAS OPTIMA PORQUE NO GUARDA PROMESAS SINO OBJETOS EXTRAIDOS DE LA PETICION EH INSERTA DICHOS OBJETOS EN UNA SOLA PETICION A LA BASE DE DATOS


    // FORMA DE INSERCION 2 MENOS OPTIMA
    
    // data.results.forEach( ({name, url}) => {
      //   const segments = url.split('/'); //dividir la url apartir del / devuelve un arreglo
      //   const no = +segments[segments.length - 2];
      
      // const pokemon = await this.pokemonModel.create({name, no});   NO ES BUENA PRACTICA PORQUE SE ESPERA A QUE SE RESUELVAN E INSERTEN LA CANTIDAD DE PROMESAS QUE EXISTAN     
      // });
      
      
    // FORMA DE INSERCION 3 MEDIANAMENTE OPTIMA //POR PROMESAS DONDE ALMACENAMOS TODAS LAS PROMESAS EN UN ARREGLO Y AL FINAL LAS EJECUTAMOS TODAS JUNTAS AL TIEMPO
      // const insertPromisesArray: Promise<Pokemon>[] = [];

      // data.results.forEach( ({name, url}) => {
      //   const segments = url.split('/'); //dividir la url apartir del / devuelve un arreglo
      //   const no = +segments[segments.length - 2];
        
      //   insertPromisesArray.push(
      //     this.pokemonModel.create({name, no})
      //   );
      
      // });

      // await Promise.all(insertPromisesArray);
    
    return 'Seed executed';
  }
}