import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import * as firebaseAdmin from 'firebase-admin';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';

@Injectable()
export class UserService {
  async registerUser(registerUser: RegisterUserDto) {
    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        displayName: registerUser.firstName,
        email: registerUser.email,
        password: registerUser.password,
      });
      return userRecord;
    } catch (error) {
      throw new Error(`User registration failed ${error.message}`);
    }
  }

  async loginUser(payload: LoginDto) {
    const { email, password } = payload;
    const { idToken, refreshToken, expiresIn } = await this.signInWithEmailAndPassword(email, password);
    return { idToken, refreshToken, expiresIn };
  }

  private async signInWithEmailAndPassword(email: string, password: string) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.APIKEY}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    });
  }

  private async sendPostRequest(url: string, data: any) {
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.log('error', error);
    }
  }
}
