import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Readable } from 'stream';
import { Repository } from 'typeorm';
import { AdminAreaDataEntity } from './admin-area-data.entity';
import csv from 'csv-parser';
import {
  UploadAdminAreaDataCsvDto,
  UploadAdminAreaDataJsonDto,
} from './dto/upload-admin-area-data.dto';
import { validate } from 'class-validator';
import { AdminDataReturnDto } from '../admin-area-dynamic-data/dto/admin-data-return.dto';
import { DynamicIndicator } from '../admin-area-dynamic-data/enum/dynamic-data-unit';

@Injectable()
export class AdminAreaDataService {
  @InjectRepository(AdminAreaDataEntity)
  private readonly adminAreaDataRepository: Repository<AdminAreaDataEntity>;

  public async uploadCsv(data): Promise<void> {
    const objArray = await this.csvBufferToArray(data.buffer);
    const validatedObjArray = await this.validateArray(objArray);

    validatedObjArray.forEach(record => {
      this.adminAreaDataRepository.delete({
        placeCode: record['placeCode'],
        indicator: record['indicator'],
      });
    });
    await this.adminAreaDataRepository.save(validatedObjArray);
  }

  public async csvBufferToArray(buffer): Promise<object[]> {
    const stream = new Readable();
    stream.push(buffer.toString());
    stream.push(null);
    const parsedData = [];
    return await new Promise(function(resolve, reject) {
      stream
        .pipe(csv())
        .on('error', error => reject(error))
        .on('data', row => parsedData.push(row))
        .on('end', () => {
          resolve(parsedData);
        });
    });
  }

  public async validateArray(csvArray): Promise<object[]> {
    const errors = [];
    const validatatedArray = [];
    for (const [i, row] of csvArray.entries()) {
      const data = new UploadAdminAreaDataCsvDto();
      data.countryCodeISO3 = row.countryCodeISO3;
      data.adminLevel = parseInt(row.adminLevel);
      data.placeCode = row.placeCode;
      data.indicator = row.indicator;
      data.value = parseFloat(row.value);
      const result = await validate(data);
      if (result.length > 0) {
        const errorObj = { lineNunber: i + 1, validationError: result };
        errors.push(errorObj);
      }
      validatatedArray.push(data);
    }
    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    return validatatedArray;
  }

  public async uploadJson(
    indicatorData: UploadAdminAreaDataJsonDto,
  ): Promise<void> {
    await this.deleteExistingEntries(indicatorData);
    const areas = [];
    for (const placeCode of indicatorData.dataPlaceCode) {
      const area = new AdminAreaDataEntity();
      area.indicator = indicatorData.indicator;
      area.value = placeCode.amount;
      area.adminLevel = indicatorData.adminLevel;
      area.placeCode = placeCode.placeCode;
      area.countryCodeISO3 = indicatorData.countryCodeISO3;
      areas.push(area);
    }
    this.adminAreaDataRepository.save(areas);
  }

  private async deleteExistingEntries(
    indicatorData: UploadAdminAreaDataJsonDto,
  ): Promise<void> {
    await this.adminAreaDataRepository.delete({
      indicator: indicatorData.indicator,
      adminLevel: indicatorData.adminLevel,
      countryCodeISO3: indicatorData.countryCodeISO3,
    });
  }

  public async getAdminAreaData(
    countryCodeISO3: string,
    adminLevel: string,
    indicator: DynamicIndicator,
  ): Promise<AdminDataReturnDto[]> {
    const result = await this.adminAreaDataRepository
      .createQueryBuilder('admin-area-data')
      .where({
        countryCodeISO3: countryCodeISO3,
        adminLevel: Number(adminLevel),
        indicator: indicator,
      })
      .select([
        'admin-area-data.value AS value',
        'admin-area-data.placeCode AS "placeCode"',
      ])
      .execute();
    return result;
  }
}
