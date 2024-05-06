import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  private readonly axios : AxiosInstance = axios;


  constructor( 
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http : AxiosAdapter,
  ){}

    async executedSeed() {

    await this.pokemonModel.deleteMany({})

    const  data =  await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
    const pokemonToInsert: {name : string, no :  number}[] = []

    data.results.forEach(({name, url}) => {
    const segments = url.split('/');
    const no = +segments [ segments.length-2];

     pokemonToInsert.push({name, no} )
     

   });
   /*const insertPromisseArray = []

   data.results.forEach(({name, url}) => {
    const segments = url.split('/');
    const no = +segments [ segments.length-2];

   

     //const pokemon = await this.pokemonModel.create({name, no} );

     insertPromisseArray.push(
       this.pokemonModel.create({name, no} )
     );

   });

   await Promise.all(insertPromisseArray);*/

   await this.pokemonModel.insertMany(pokemonToInsert);

    return 'seed execut';
  }

 
}
