// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      // Retourne l'utilisateur sans le password
      const { password: _, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword as Omit<User, 'password'>;
    }

    return null;
  }

  async login(
    loginDto: LoginDto
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: (user as any)._id?.toString() || '',
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (user as any)._id?.toString(),
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async register(
    registerDto: RegisterDto
  ): Promise<{ access_token: string; user: any }> {
    // Crée l'utilisateur via UsersService
    const user = await this.usersService.create(registerDto);

    // Génère le token
    const payload: JwtPayload = {
      email: user.email,
      sub: (user as any)._id?.toString() || '',
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (user as any)._id?.toString(),
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
