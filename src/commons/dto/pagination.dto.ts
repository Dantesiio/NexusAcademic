import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationDto {
    @ApiPropertyOptional({
        description: "Número máximo de elementos a retornar por página",
        example: 10,
        default: 10,
        minimum: 1,
        maximum: 100,
        type: Number
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiPropertyOptional({
        description: "Número de elementos a omitir para la paginación",
        example: 0,
        default: 0,
        minimum: 0,
        type: Number,
        format: 'int32'
    })
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    offset?: number;
}
