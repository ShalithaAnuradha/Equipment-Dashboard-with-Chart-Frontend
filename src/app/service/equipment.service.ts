import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Equipment} from '../model/equipment';

@Injectable()
export class EquipmentService {

  equipmentList: Array<Equipment> = [];
  operational = 0;
  max = 0;
  noOfElements = 50;
  last = 0;

  constructor(private httpClient: HttpClient) {
  }

  getAllEquipments(maxVal: number, lastVal: number): Observable<Array<Equipment>> {
    return this.httpClient.get<Array<Equipment>>(`http://localhost:8080/api/v1/equipments?max=${maxVal}&last=${lastVal}`);
  }

}
