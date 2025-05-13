import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from "../interfaces/jwt.interface";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private configService: ConfigService,
        private authService: AuthService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET') as string,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true
        })
    }

    async validate(req: any, payload: JwtPayload): Promise<User> {
        const {id} = payload;
        const user = await this.userRepository.findOneBy({id});

        if(!user) throw new UnauthorizedException(`Token not valid`);
        if(!user.isActive) throw new UnauthorizedException(`User is not active`);

        const token = req.headers.authorization?.split(' ')[1];
        if (token && this.authService.isTokenBlacklisted(token)) {
            throw new UnauthorizedException('Token has been invalidated');
        }

        delete user.password;
        return user;
    }
}