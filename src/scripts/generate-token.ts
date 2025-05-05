// scripts/generate-token.ts
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule }  from '../app.module';
import { AuthService } from '../auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import * as jwt     from 'jsonwebtoken';
import * as readline from 'readline';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

async function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Uso: npx ts-node -r tsconfig-paths/register scripts/generate-token.ts <email>');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const authService = app.get(AuthService);
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

  let user = await userRepo.findOne({ where: { email },
    select: ['id','email','fullName','roles','password'] });

  if (!user) {
    console.log(`⚠️  Usuario "${email}" no existe. Lo vamos a crear.`);

    const password = await askQuestion('🔑 Contraseña: ');
    const fullName = await askQuestion('👤 Nombre completo: ');
    const rolesInput = await askQuestion(
      `🛡️ Roles (comma-separated, opciones: ${Object.values(ValidRoles).join(', ')}) [Enter para dejar rol por defecto: ${ValidRoles.teacher}]: `
    );
    const roles = rolesInput
      ? rolesInput.split(',').map(r => r.trim()).filter(r => Object.values(ValidRoles).includes(r as ValidRoles))
      : [ValidRoles.teacher];

    if (roles.length === 0) {
      console.error('❌ Ningún rol válido proporcionado. Abortando.');
      await app.close();
      process.exit(1);
    }

    const created = await authService.create({ email, password, fullName });
    if (!created) {
      console.error('❌ authService.create devolvió undefined');
      await app.close();
      process.exit(1);
    }

    await userRepo.update(created.id, { roles });

    user = {
      id:       created.id,
      email:    created.email,
      fullName: created.fullName,
      roles:    roles,
      password: '' as any,
    } as User;

    console.log('🎉 Usuario creado:', {
      id:       user.id,
      email:    user.email,
      fullName: user.fullName,
      roles:    user.roles,
    });
  }

  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign({ id: user.id }, secret, { expiresIn: '24h' });
  console.log('\n✅ Token generado:\n', token);

  await app.close();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error en generate-token:', err);
  process.exit(1);
});
