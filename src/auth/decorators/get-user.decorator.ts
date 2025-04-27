import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data, context : ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        
        const user = req.user;

        if(!user) throw new InternalServerErrorException(`User ${user.email} not found`);

        return (!data) ? user: user[data];
    }
)