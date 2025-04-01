import axios from 'axios';

export class GoogleService {
  async getUserInfo(tokenGoogle: string): Promise<{ email: string; name: string; picture: string }> {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenGoogle}`
    );

    const { email, name, picture } = response.data;

    if (!email) {
      throw new Error('Não foi possível obter o e-mail do usuário.');
    }

    return { email, name, picture };
  }
}