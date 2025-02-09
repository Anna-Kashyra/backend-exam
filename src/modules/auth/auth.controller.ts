import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './services/auth.service';
import { SignInRequestDto, SignUpRequestDto } from './dto/auth.request.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import { RefreshGuard } from './guards/refresh.guard';
import { CurrentUser } from './decorators/current.user.decorator';
import { IUserData } from './interfaces/user.data.interface';
import { TokenPairResponseDto } from './dto/token.pair.response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@ApiExtraModels(SignUpRequestDto, AuthResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User Registration',
    description:
      'Allows a new user to register by providing the required information',
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Post('sign-up')
  public async signUp(@Body() dto: SignUpRequestDto): Promise<AuthResponseDto> {
    return await this.authService.signUp(dto);
  }

  @ApiOperation({
    summary: 'User Authentication',
    description:
      'Verifying user credentials to grant access to protected resources',
  })
  @ApiCreatedResponse({
    description: 'User successfully authenticated',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Post('sign-in')
  public async signIn(@Body() dto: SignInRequestDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(dto);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshGuard)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer refresh token',
    required: true,
  })
  @ApiOperation({
    summary: 'Refresh token pair',
    description:
      'Deletes old user tokens, generates a new pair of access and refresh tokens and stores them',
  })
  @ApiCreatedResponse({
    description: 'Token pair successfully created',
    type: TokenPairResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResponseDto> {
    return await this.authService.refresh(userData);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'))
  @ApiOperation({
    summary: 'Logout',
    description: 'Ends a user session on a specific device',
  })
  @ApiNoContentResponse({ description: 'User successfully logged out' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(204)
  @Post('logout')
  public async logout(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.authService.logout(userData);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'))
  @ApiOperation({
    summary: 'Logout from all devices',
    description: 'Ends all user sessions on all devices',
  })
  @ApiNoContentResponse({
    description: 'User successfully logged out from all devices',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(204)
  @Post('logout-all')
  public async logoutAll(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.authService.logoutAll(userData);
  }
}
