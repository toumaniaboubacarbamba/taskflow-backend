/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
  })
  username: string;

  @Prop({
    required: true,
    select: false, // Exclut le password des requêtes par défaut
  })
  @Exclude() // Exclut lors de la sérialisation avec class-transformer
  password: string;

  @Prop({
    default: '',
    trim: true,
  })
  avatarUrl: string;

  @Prop({ default: true })
  isActive: boolean;

  // Ces champs sont ajoutés automatiquement par timestamps: true
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
