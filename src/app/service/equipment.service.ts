import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Equipment} from '../model/equipment';


@Injectable()
export class EquipmentService {

  equipmentList: Array<Equipment> = [];
  operational = 0;
  nonOperational = 0;
  max = 50;
  last = 0;

  constructor(private httpClient: HttpClient) {
  }

  getAllEquipments(maxValue: number, lastValue: number): Observable<Array<Equipment>> {
    return this.httpClient.get<Array<Equipment>>(`http://localhost:8080/api/v1/customers?max=${maxValue}&limit=${lastValue}`);
  }

}
