import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationDto {
    @ApiPropertyOptional({
        description: "Número máximo de elementos a retornar",
        example: 10,
        minimum: 1,
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiPropertyOptional({
        description: "Número de elementos a omitir (offset)",
        example: 0,
        minimum: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    offset?: number;
}
