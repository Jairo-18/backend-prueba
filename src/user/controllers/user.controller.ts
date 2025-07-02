import { CrudUserUC } from './../useCases/crudUserUC';
import { User } from 'src/shared/entities/user.entity';
import {
  CreateUserRelatedDataReponseDto,
  PaginatedListUsersParamsDto,
} from '../dtos/crudUser.dto';
import {
  CreatedRecordResponseDto,
  DeleteReCordResponseDto,
  DuplicatedResponseDto,
  NotFoundResponseDto,
  UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  UpdateUserDto,
  GetUserResponseDto,
} from '../dtos/user.dto';
import { UserUC } from '../useCases/userUC.uc';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponsePaginationDto } from 'src/shared/dtos/pagination.dto';

@Controller('user')
@ApiTags('Usuarios')
export class UserController {
  constructor(
    private readonly _userUC: UserUC,
    private readonly _crudUserUC: CrudUserUC,
  ) {}

  // --- Endpoints de Listado y Búsqueda ---
  // Ruta principal para obtener la lista paginada de usuarios (más común)
  @Get('paginated-list') // Cambiado de '/paginated-list' a la base, ya que es el listado principal
  @ApiOkResponse({ type: ResponsePaginationDto<User> })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getPaginatedList(
    @Query() params: PaginatedListUsersParamsDto,
  ): Promise<ResponsePaginationDto<User>> {
    // Si no se proporcionan parámetros de paginación, puedes establecer valores por defecto
    // o asumir que el cliente siempre los enviará.
    return await this._crudUserUC.paginatedList(params);
  }

  // Si aún quieres un endpoint para obtener TODOS los usuarios sin paginación (menos común en APIs grandes)
  // podrías darle una ruta explícita o considerar eliminarlo si `getPaginatedList` cubre el caso.
  // @Get('/all') // Opción: darle una ruta explícita
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  // @ApiOkResponse({ type: GetAllUsersResposeDto })
  // async findAll(): Promise<GetAllUsersResposeDto> {
  //   const users = await this._userUC.findAll(); // Asegúrate de que _userUC.findAll() no tome parámetros de paginación
  //   return {
  //     statusCode: HttpStatus.OK,
  //     data: { users },
  //   };
  // }

  // Endpoint para obtener un usuario por ID
  @Get(':id') // Se mantiene igual, es específico para IDs
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: GetUserResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async findOne(@Param('id') id: string): Promise<GetUserResponseDto> {
    const user = await this._userUC.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  // --- Endpoints de Datos Relacionados ---
  // Ruta para datos relacionados para la creación de usuarios (requiere autenticación)
  @Get('related-data/create') // Cambiado a un anidamiento más lógico para "related-data"
  @ApiOkResponse({ type: CreateUserRelatedDataReponseDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getRelatedDataForCreate(): Promise<CreateUserRelatedDataReponseDto> {
    const data = await this._crudUserUC.getRelatedDataToCreate(false);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  // Ruta para datos relacionados para el registro de usuarios (no requiere autenticación)
  @Get('related-data/register') // Cambiado a un anidamiento más lógico para "related-data"
  @ApiOkResponse({ type: CreateUserRelatedDataReponseDto })
  async getRelatedDataForRegister(): Promise<CreateUserRelatedDataReponseDto> {
    // Renombrado para claridad
    const data = await this._crudUserUC.getRelatedDataToCreate(true);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  // --- Endpoints de Creación ---
  // Ruta para crear un usuario (Admin)
  @Post() // Se mantiene en la ruta base para la creación general
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: CreatedRecordResponseDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async create(@Body() user: CreateUserDto): Promise<CreatedRecordResponseDto> {
    const rowId = await this._userUC.create(user);
    return {
      message: 'Usuario creado correctamente',
      statusCode: HttpStatus.CREATED,
      data: rowId,
    };
  }

  // Ruta para el registro de usuarios (sin autenticación, abierta al público)
  @Post('register') // Se mantiene igual
  @ApiOkResponse({ type: CreatedRecordResponseDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async register(
    @Body() user: CreateUserDto,
  ): Promise<CreatedRecordResponseDto> {
    const rowId = await this._userUC.register(user);
    return {
      message: 'Registro exitoso',
      statusCode: HttpStatus.CREATED,
      data: rowId,
    };
  }

  // --- Endpoints de Actualización y Eliminación ---
  @Patch(':id') // Se mantiene igual
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: UpdateRecordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async update(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._userUC.update(id, userData);

    return {
      message: 'Usuario actualizado correctamente',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id') // Se mantiene igual
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async delete(@Param('id') id: string): Promise<DeleteReCordResponseDto> {
    await this._userUC.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario eliminado exitosamente',
    };
  }
}
