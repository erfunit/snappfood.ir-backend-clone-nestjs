import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import {
  CreateSupplierDto,
  LoginSupplierDto,
  SupplimentaryInformationDto,
} from './dto/create-supplier.dto';
import { CategoryService } from '../category/category.service';
import { SupplierOTPEntity } from './entities/supplier-otp.entity';
import { randomInt } from 'crypto';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import { TokensPayload } from '../auth/types/payload';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SupplierStatus } from './enum/supplier-status.enum';
import { DocumentsType } from './types/doc.type';
import { S3Service } from '../s3/s3.service';
import { SupplierDocsEntity } from './entities/supplier-docs.entity';

@Injectable({ scope: Scope.REQUEST })
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(SupplierOTPEntity)
    private readonly otpRepository: Repository<SupplierOTPEntity>,
    @InjectRepository(SupplierDocsEntity)
    private readonly supplierDocsRepository: Repository<SupplierDocsEntity>,
    private readonly categoryService: CategoryService,
    private readonly jwtService: JwtService,
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly s3Service: S3Service,
  ) {}

  async supplierSingup(signupDto: CreateSupplierDto) {
    const {
      manager_family,
      manager_name,
      store_name,
      mobile,
      category_id,
      agent_id,
    } = signupDto;
    const existingSupplierWithMobile = await this.supplierRepository.findOneBy({
      mobile,
    });
    if (existingSupplierWithMobile)
      throw new ConflictException(
        'A supplier with this phone number already exists',
      );
    const category = await this.categoryService
      .findOneById(category_id)
      .then((data) => data)
      .catch(() => {
        throw new NotFoundException('category not found');
      });
    const agent = await this.supplierRepository.findOneBy({ id: agent_id });
    if (!agent && agent_id) throw new NotFoundException('agent not found');
    const invite_code = parseInt(mobile).toString(32).toUpperCase();
    const supplier = this.supplierRepository.create({
      manager_family,
      manager_name,
      store_name,
      mobile,
      category_id: category.id,
      agentId: agent_id,
      invite_code,
    });
    await this.supplierRepository.save(supplier);
    await this.createOtpForSupplier(supplier);
    return {
      message: 'otp code sent successfully',
    };
  }

  async loginSupplier({ mobile }: LoginSupplierDto) {
    const supplier = await this.supplierRepository.findOneBy({ mobile });
    if (!supplier)
      throw new NotFoundException('supplier with this phone number not found');
    await this.createOtpForSupplier(supplier);
    return {
      message: 'otp code sent successfully',
    };
  }

  async saveSupplimentaryInformation(infoDto: SupplimentaryInformationDto) {
    const { id } = this.request.user;
    const { email, national_code } = infoDto;
    let supplier = await this.supplierRepository.findOneBy({ national_code });
    if (supplier && supplier.id !== id)
      throw new ConflictException('national code already used');
    supplier = await this.supplierRepository.findOneBy({ email });
    if (supplier && supplier.id !== id)
      throw new ConflictException('email code already used');

    await this.supplierRepository.update(
      { id },
      { email, national_code, status: SupplierStatus.SupplimentaryInformation },
    );

    return {
      message: 'information updated successfully',
    };
  }

  async createOtpForSupplier(supplier: SupplierEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.otpRepository.findOneBy({ supplierId: supplier.id });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException('otp code not expired');
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expires_in: expiresIn,
        supplierId: supplier.id,
      });
    }
    otp = await this.otpRepository.save(otp);
    supplier.otpId = otp.id;
    await this.supplierRepository.save(supplier);
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { code, mobile } = otpDto;
    const now = new Date();
    const supplier = await this.supplierRepository.findOne({
      where: { mobile },
      relations: {
        otp: true,
      },
    });
    if (!supplier || !supplier?.otp)
      throw new UnauthorizedException('Not Found Account');
    const otp = supplier?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException('Otp code is incorrect');
    if (otp.expires_in < now)
      throw new UnauthorizedException('Otp Code is expired');
    if (!supplier.mobile_verify) {
      await this.supplierRepository.update(
        { id: supplier.id },
        {
          mobile_verify: true,
        },
      );
    }
    await this.supplierRepository.update(
      { id: supplier.id },
      { status: SupplierStatus.Registered },
    );
    const { accessToken, refreshToken } = this.makeTokensForUser({
      id: supplier.id,
    });
    return {
      accessToken,
      refreshToken,
      message: 'phone number registered successfully',
    };
  }

  async uploadDocuments(files: DocumentsType) {
    const { id: supplierId } = this.request.user;
    const supplier = await this.supplierRepository.findOneBy({
      id: supplierId,
    });
    const { acceptedDoc, image } = files;
    const docsLocation = `user-docs/${supplierId}`;
    const acceptedDocResult = await this.s3Service.updloadFile(
      acceptedDoc[0],
      docsLocation,
    );
    const imageResult = await this.s3Service.updloadFile(
      image[0],
      docsLocation,
    );

    let supplierDocs = await this.supplierDocsRepository.findOneBy({
      supplierId,
    });

    if (
      !acceptedDocResult ||
      !acceptedDocResult?.Location ||
      !imageResult ||
      !imageResult?.Location
    )
      throw new InternalServerErrorException('Uploading failed, try again');

    if (supplierDocs) {
      supplierDocs.acceptedDoc = acceptedDocResult?.Location;
      supplierDocs.image = imageResult?.Location;
    } else {
      supplierDocs = this.supplierDocsRepository.create({
        acceptedDoc: acceptedDocResult?.Location,
        image: imageResult?.Location,
        supplierId,
      });
    }

    supplier.status = SupplierStatus.UploadedDocuments;
    await this.supplierDocsRepository.save(supplierDocs);
    await this.supplierRepository.save(supplier);

    return {
      message: 'docs successfully uploaded',
    };
  }

  makeTokensForUser(payload: TokensPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '30d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '1y',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TokensPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === 'object' && payload?.id) {
        const user = await this.supplierRepository.findOneBy({
          id: payload.id,
        });
        if (!user) {
          throw new UnauthorizedException('login on your account ');
        }
        return user;
      }
      throw new UnauthorizedException('login on your account ');
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('login on your account ');
    }
  }
}
