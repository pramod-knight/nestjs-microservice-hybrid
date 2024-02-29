import { IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class ListPostModuleDto {
    
    @IsNotEmpty()
    @IsNumber()
    pageNumber:number;

    @IsNotEmpty()
    @IsNumber()
    itemsPerPage:number;

    @IsOptional()
    user_id:string;
}
