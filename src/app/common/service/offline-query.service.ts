import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { OfflineManagerService } from 'src/app/middleware/offline-manager.service';
import { EquipmentRecord } from '../type/common.model';
import {
  ListItem, SmartInput, RequestEquipmentAdd, Uniformat, UniformatDescription, Step2EquipTypeData, Step2ValidationData,
  Step1ClientData, Step1ValidationData, Step4WarrantyData, Step4ValidationData
} from '../type/equipment-steps';

@Injectable({
  providedIn: 'root'
})
export class OfflineQueryService {

  constructor(private offlineManager: OfflineManagerService) { }

  private _query: string;
  get SqliteQuery(): string {
    return this._query;
  }
  set SqliteQuery(value: string) {
    this._query = value;
  }

  async getEquipmentById(eq: number) {
    let query = 'select E.*, B.Name as BuildingName, F.Description as FMZDesc, R.Description as RegionDesc  from Equipment E join Buildings B on B.BuildingId = E.BuildingId '
    query += 'join FMZ F on B.FMZId = F.Id join Regions R on F.RegionId =R.Id where E.id = ?'
    return await this.offlineManager.executeQuery(query, [eq]).then(async (data) => {
      if (data.rows.length > 0) {
        let equipment: RequestEquipmentAdd = new RequestEquipmentAdd();
        let item = data.rows.item(0);
        equipment.EqNum = item.Number;
        equipment.IsDFM = item.IsDFM;
        equipment.BuildingId = item.BuildingId;
        equipment.BuildingDesc = item.BuildingName;
        equipment.FMZDesc = item.FMZDesc;
        equipment.RegionDesc = item.RegionDesc;
        equipment.BuildingItemId = item.Id;
        equipment.Description = item.Description;
        equipment.CriticalityCode = item.CriticalityCode;
        equipment.ConditionRating = item.ConditionRating;
        equipment.ClientCode = item.ClientCode;
        equipment.FieldItemNumber = item.FieldItemNumber;
        equipment.ModelName = item.ModelName;
        equipment.ModelNumber = item.Model;
        equipment.StartDate = item.StartDate;
        equipment.KeyDate = item.KeyDate;
        equipment.Ownership = item.Ownership;
        equipment.ParentItemId = item.ParentItemId;
        equipment.PartWarrantyExpirationDate = item.PartWarrantyExpirationDate;
        equipment.LabourWarrantyExpirationDate = item.LabourWarrantyExpirationDate;
        equipment.AcquisitionStatus = item.AcquisitionStatus;
        equipment.DispositionStatus = item.DispositionStatus;
        equipment.VendorName = item.VendorName;
        equipment.isInHerigageArea = item.Heritage;
        equipment.InstallationDate = item.InstallationDate;
        equipment.ClientLocation = item.Location;
        equipment.SpecificLocation = item.SpecificLocation;
        equipment.SerialNumber = item.SerialNumber;
        equipment.isMaintenanceResponsibility = item.MaintenanceResponsibility;
        equipment.PurchaseDate = item.PurchaseDate;
        equipment.PurchasePrice = item.PurchasePrice;
        equipment.FloorId = item.FloorId;
        equipment.AreaId = item.AreaId;
        equipment.SystemTypeId = item.SystemTypeId;
        equipment.floorSearchValue = await this.getFloorNameById(item.FloorId);
        equipment.BuildingItemTypeId = item.Uniformat;
        equipment.BuildingItemTypeDesc = (await this.getUniformatById(item.Uniformat)).Description;
        equipment.Manufacturer = item.Manufacturer;
        equipment.ManufacturedDate = item.ManufacturedDate;

        const isDFM = await this.IsDFM(item.BuildingId);
        equipment.fields = await this.getUserFields(isDFM ? item.Uniformat : item.SystemTypeId, isDFM);
        equipment.CrossRef = item.EqCrossReferenceId;
        // equipment.Uniformat - item.Uniformat;

        equipment.isRepExistEqu = !!item.EqCrossReferenceId;
        //equipment.commentNote
        let details = JSON.parse(item.UserDefined);
        for (let d in details) {
          switch (d) {
            case 'UD1': equipment.DETAIL1 = details[d]; break;
            case 'UD2': equipment.DETAIL2 = details[d]; break;
            case 'UD3': equipment.DETAIL3 = details[d]; break;
            case 'UD4': equipment.DETAIL4 = details[d]; break;
            case 'UD5': equipment.DETAIL5 = details[d]; break;
            case 'UD6': equipment.DETAIL6 = details[d]; break;
            case 'UD7': equipment.DETAIL7 = details[d]; break;
            case 'UD8': equipment.DETAIL8 = details[d]; break;
            case 'UD9': equipment.DETAIL9 = details[d]; break;
            case 'UD10': equipment.DETAIL10 = details[d]; break;
            case 'UD11': equipment.DETAIL11 = details[d]; break;
            case 'UD12': equipment.DETAIL12 = details[d]; break;
            case 'UD13': equipment.DETAIL13 = details[d]; break;
            case 'UD14': equipment.DETAIL14 = details[d]; break;
            case 'UD15': equipment.DETAIL15 = details[d]; break;
            case 'UD15': equipment.DETAIL16 = details[d]; break;
            case 'UD17': equipment.DETAIL17 = details[d]; break;
            case 'UD18': equipment.DETAIL18 = details[d]; break;
            case 'UD19': equipment.DETAIL19 = details[d]; break;
            case 'UD20': equipment.DETAIL20 = details[d]; break;
            case 'UD21': equipment.DETAIL21 = details[d]; break;
            case 'UD22': equipment.DETAIL22 = details[d]; break;
            case 'UD23': equipment.DETAIL23 = details[d]; break;
            case 'UD24': equipment.DETAIL24 = details[d]; break;
            case 'UD25': equipment.DETAIL25 = details[d]; break;
            case 'UD26': equipment.DETAIL26 = details[d]; break;
            case 'UD27': equipment.DETAIL27 = details[d]; break;
            case 'UD28': equipment.DETAIL28 = details[d]; break;
            case 'UD29': equipment.DETAIL29 = details[d]; break;
            case 'UD30': equipment.DETAIL30 = details[d]; break;
          }
        }
        // equipment.
        return equipment;
      }
    });
  }

  async getBuildingDescByCode(buildingCode: string): Promise<string> {
    let query = 'select Name from Buildings where BuildingId = ?';
    return await this.offlineManager.executeQuery(query, [buildingCode]).then(data => {
      if (data.rows.length > 0) {
        let item = data.rows.item(0);
        return item.Name;
      } else return '';
    });
  }

  async getFloorNameById(floorId: number): Promise<string> {
    let query = 'select Description from Floors where Id = ?';
    return await this.offlineManager.executeQuery(query, [floorId]).then(data => {
      if (data.rows.length > 0) {
        let item = data.rows.item(0);
        return item.Description;
      } else return '';
    });
  }

  async getUniformatById(uniformatId: number): Promise<any> {
    let query = 'select * from Uniformats where Id = ?';
    return await this.offlineManager.executeQuery(query, [uniformatId]).then(data => {
      if (data.rows.length > 0) {
        let item = data.rows.item(0);
        return item;
      } else return '';
    });
  }

  async getUserFields(id: number, isDfm: boolean): Promise<UniformatDescription[]> {
    const data = await this.getUniformatCodeAndClientId(isDfm, id);
    const code = data.Code;
    const clientId = data.ClientId;
    if (code !== '') {
      console.log('client id', clientId)
      let query = 'SELECT F.* from UserDefinedTemplate T join UserDefinedFields F on T.Id = F.TemplateId where T.ClientId = ? and T.BuildingItemTypeCode = ?';
      return await this.offlineManager.executeQuery(query, [clientId, code]).then(data => {
        let fields: UniformatDescription[] = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            let item = data.rows.item(i);
            let values: ListItem[] = []
            if (item.Values) {
              let _ = JSON.parse(item.Values);
              for (let field of _) {
                values.push({ Key: field.Id, Value: field.Value, ParentFieldName: '', ParentId: '' });
              }
            }
            fields.push({
              ControlType: item.Type,
              DataType: item.PropertyDataType,
              Description: item.Label,
              ErrorDescription: '',
              Id: item.Id,
              IsRequired: item.IsRequired,
              LookupName: item.LookupTypeClass,
              Name: item.Name,
              MaxValue: item.MaxValue,
              MinValue: item.MinValue,
              Legnth: item.MaxLength,
              UDF: '', FilterOptions: [],
              ListOfItems: values,
              UDFOptionSearchKey: '',
              UDFOptionSearchValue: '',
              UDFOptionSearchValueBak: '',
              isSearchValueValid: false,
              showNoResult: false,
              showOptions: false
            })
          }
        }
        return fields;
      });
    } else return [];
  }

  private async getUniformatCodeAndClientId(isDFM: boolean, id: number) {
    let query = 'SELECT Code, ClientId from Uniformats where Id = ?'
    if (!isDFM) query = 'SELECT Code, ClientId from SystemTypes where Id = ?';
    return await this.offlineManager.executeQuery(query, [id]).then(data => {
      if (data.rows.length > 0) {
        let item = data.rows.item(0);
        let code = item.Code;
        if (!isDFM) {
          const len = item.Code.length;
          if (len == 1) code = '00' + item.Code;
          else if (len == 2) code = '0' + item.Code;
        }
        return { Code: code, ClientId: +item.ClientId }
      }
      else return { Code: '', ClientId: -1 };
    });
  }

  async getSystemTypeCodeById(id: number): Promise<string> {
    let query = 'Select Code from SystemTypes where Id = ?'
    return await this.offlineManager.executeQuery(query, [id]).then(data => {
      if (data.rows.length > 0) {
        let item = data.rows.item(0);
        const len = item.Code.length;
        return len < 3 ? (len === 2 ? '0' + item.Code : '00' + item.Code) : item.Code;
      } return '';
    })
  }

  async getBuildings(): Promise<ListItem[]> {
    let query = 'Select BuildingId, Name from Buildings';
    return await this.offlineManager.executeQuery(query, []).then(data => {
      let buildings: ListItem[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          let item = data.rows.item(i);
          buildings.push({ Key: item.BuildingId, Value: item.Name, ParentId: '', ParentFieldName: '' });
        }
      }
      return buildings;
    });
  }

  async getEquipmentRecords(buildingId: string): Promise<EquipmentRecord[]> {
    let query = 'Select * from equipment where BuildingId = ?';
    return await this.offlineManager.executeQuery(query, [buildingId]).then(async (data) => {
      let equipments: EquipmentRecord[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          let item = data.rows.item(i);
          equipments.push({
            BuildingId: buildingId,
            Description: item.Description,
            Eqnum: item.Number,
            EqtypeCode: (await this.getUniformatById(item.Uniformat)).Code,
            EquipmentId: item.Id,
            FieldItemNum: item.FieldItemNumber,
            Manufacturer: item.Manufacturer,
            ModelName: item.ModelName,
            ModelNumber: item.Model,
            SerialNum: item.SerialNumber,
            ShortDesc: '',
            Status:item.Status,
            IsDFM:'',
            SystemType: await this.getSystemTypeDescById(item.SystemTypeId)
          });
        }
      }
      return equipments;
    });
  }

  async getSystemTypeDescById(id: number): Promise<string> {
    return await this.offlineManager.executeQuery('Select * from SystemTypes where Id = ?', [id]).then(data => {
      if (data.rows.length > 0) {
        const item = data.rows.item(0);
        return item.Description
      }
      return '';
    });
  }

  async getFloorsByBuildingId(id: string): Promise<ListItem[]> {
    const query = 'SELECT * from Floors where PhysicalLocationId = (SELECT PhysicalLocationId from Buildings where BuildingId = ?)';
    return this.offlineManager.executeQuery(query, [id]).then(data => {
      let floors: ListItem[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          const item = data.rows.item(i);
          floors.push({ Key: item.Id, Value: item.Code + '-' + item.Description, ParentFieldName: '', ParentId: '' });
        }
      }
      return floors;
    });
  }

  async getAreasByFloorId(floorId: number): Promise<ListItem[]> {
    const query = 'Select * from Area where FloorId = ?';
    return await this.offlineManager.executeQuery(query, [floorId]).then(data => {
      let areas: ListItem[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          const item = data.rows.item(i);
          areas.push({ Key: item.Id, Value: item.Code, ParentFieldName: '', ParentId: '' });
        }
      }
      return areas;
    });
  }

  async getLookUpByLookupType(clientId: number, type: LookupType): Promise<ListItem[]> {
    let query = 'Select * from Lookups where LookupType = ?';
    let lookupType = '';
    switch (type) {
      case LookupType.Ownsership: {
        lookupType = 'OWNERSHIP';
        query += ' and  ClientId = ' + clientId;
        break;
      }
      case LookupType.DispositionStatus: {
        lookupType = 'RCND.EQUIPMENT_DISPOSITIONSTATUS';
        query += ' and  ClientId = ' + clientId;
        break;
      }
      case LookupType.AcquisitionStatus: {
        lookupType = 'RCND.EQUIPMENT_ACQUISITIONSTATUS';
        break;
      }
    }

    return await this.offlineManager.executeQuery(query, [lookupType]).then(data => {
      let lookups: ListItem[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          const item = data.rows.item(i);
          lookups.push({ Key: item.LookupKey, Value: item.LookupValue, ParentFieldName: '', ParentId: '' });
        }
      }
      return lookups;
    });
  }

  async getEquipmentListByBuildingId(buildingId: string): Promise<ListItem[]> {
    let equipments: ListItem[] = [];
    const records = await this.getEquipmentRecords(buildingId);
    for (let eq of records) {
      equipments.push({ Key: `${eq.EquipmentId}`, Value: eq.Eqnum, ParentFieldName: '', ParentId: '' })
    }
    return equipments;
  }

  async getSystemTypesByClientId(clientId: number): Promise<ListItem[]> {
    const query = 'Select * from SystemTypes where ClientId = ?';
    return await this.offlineManager.executeQuery(query, [clientId]).then(data => {
      let systemTypes: ListItem[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          const item = data.rows.item(i);
          systemTypes.push({ Key: item.Id, Value: item.Code + ' - ' + item.Description, ParentFieldName: '', ParentId: '' });
        }
      }
      return systemTypes;
    });
  }

  async getUniformatsByClientId(clientId: number, isDFM: boolean): Promise<Uniformat[]> {
    const query = 'Select * from Uniformats where ClientId = ?';
    return await this.offlineManager.executeQuery(query, [clientId]).then(async (data) => {
      let uniformats: Uniformat[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          const item = data.rows.item(i);
          uniformats.push({
            Id: item.Id,
            UDescList: await this.getUserFields(item.Id, isDFM),
            Code: item.Code,
            UDescription: item.Description,
            FlexTemplateId: ''
          });
        }
      }
      return uniformats;
    });
  }

  async IsDFM(buildingId: string): Promise<boolean> {
    return await this.offlineManager.executeQuery('SELECT e.IsDFM from Equipment e join Buildings b on b.BuildingId = e.BuildingId where e.BuildingId = ? limit 1 OFFSET 1', [buildingId]).then(data => {
      let isDfm = true;
      if (data.rows.length > 0) {
        isDfm = data.rows.item(0).IsDFM;
      }
      return isDfm;
    })
  }

  async getBuildingFMZAndRegionDesc(buildingId: string): Promise<any> {
    return await this.offlineManager.executeQuery('SELECT B.Name as BuildingDesc, F.Description as FMZDesc, R.Description as RegionDesc from Buildings B join FMZ F on F.Id = B.FMZId join Regions R on R.Id = F.RegionId where B.BuildingId = ?', [buildingId]).then(data => {
      let _ = {};
      if (data.rows.length > 0) {
        return { BuildingDesc: data.rows.item(0).BuildingDesc, FMZDesc: data.rows.item(0).FMZDesc, RegionDesc: data.rows.item(0).RegionDesc };
      }
      return _;
    })
  }

  async getParentItemList(buildingId: string, eqId?: number, floorId?: number): Promise<ListItem[]> {
    const IsDFM = await this.IsDFM(buildingId);
    let query = "SELECT Id, Number || '-' || Description as Value from Equipment where BuildingId = ? and InActive = 'false' ";

    let params: any[] = [buildingId];
    if (!!floorId) {
      query += ' and FloorId = ? ';
      params.push(floorId)
    }
    if (!!eqId) {
      query += ' and Id <> ? ';
      params.push(eqId)
    }
    if (IsDFM) {
      query += ' and Number like ?'
      params.push(`EQ-${buildingId.trim()}%`);
    }
    return await this.offlineManager.executeQuery(query, params).then(data => {
      let parentItems: ListItem[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          const item = data.rows.item(i);
          parentItems.push({ Key: item.Id, Value: item.Value, ParentFieldName: '', ParentId: '' });
        }
      }
      return parentItems;
    });
  }

  async getEntityInactiveLookupItems(buildingId: string, eqId: number): Promise<ListItem[]> {
    let query = "SELECT Id, Number || '-' || Description as Value from Equipment where BuildingId = ? and Id <> ? and Status <> 'Active' ";

    let params: any[] = [buildingId, eqId];
    return await this.offlineManager.executeQuery(query, params).then(data => {
      let inactivelookups: ListItem[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          const item = data.rows.item(i);
          inactivelookups.push({ Key: item.Id, Value: item.Value, ParentFieldName: '', ParentId: '' });
        }
      }
      return inactivelookups;
    });
  }

  async getClientIdByBuildingId(buildingId: string): Promise<any> {
    return await this.offlineManager.executeQuery('Select ClientId from Buildings where BuildingId = ?', [buildingId]).then(data => {
      if (data.rows.length > 0) {
        return +data.rows.item(0).ClientId;
      }
      return null;
    })
  }

  async getAreasByBuildingId(buildingId: string): Promise<ListItem[]> {
    return await this.offlineManager.executeQuery('SELECT A.* from Area A JOIN Floors F on A.FloorId = F.Id JOIN Buildings B on B.PhysicalLocationId = F.PhysicalLocationId where B.BuildingId = ?', [buildingId]).then(data => {
      let areas: ListItem[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          let item = data.rows.item(0);
          areas.push({ Key: item.Id, Value: item.Code, ParentFieldName: '', ParentId: item.FloorId });
        }
      }
      return areas;
    })
  }

  async getStep1ClientData(BuildingId: string): Promise<Step1ClientData> {
    const step1Data: Step1ClientData = new Step1ClientData();
    step1Data.Floor = new SmartInput();
    step1Data.Floor.ListOfItems = await this.getFloorsByBuildingId(BuildingId);
    step1Data.Area = new SmartInput();
    step1Data.Area.ListOfItems = await this.getAreasByFloorId(parseInt(BuildingId));
    step1Data.VALDATA = new Step1ValidationData();
    let _buildingDesc = await this.getBuildingFMZAndRegionDesc(BuildingId);
    step1Data.RegionDescription = _buildingDesc.RegionDesc;
    step1Data.FmzDescription = _buildingDesc.FMZDesc;
    step1Data.BuildingDescription = _buildingDesc.BuildingDesc;
    step1Data.VALDATA.RegionDesc = _buildingDesc.RegionDesc;
    step1Data.VALDATA.FMZDesc = _buildingDesc.FMZDesc;
    step1Data.VALDATA.BuildingDesc = _buildingDesc.BuildingDesc;;
    return step1Data;
  }

  async getStep2EquipmentTypetData(BuildingId: string): Promise<Step2EquipTypeData> {
    const isDFM = await this.IsDFM(BuildingId);
    const step2Data: Step2EquipTypeData = new Step2EquipTypeData();
    const _clientId = await this.getClientIdByBuildingId((BuildingId))
    step2Data.ParentItem = new SmartInput();
    step2Data.ParentItem.ListOfItems = await this.getFloorsByBuildingId(BuildingId);
    step2Data.SystemType = new SmartInput();
    step2Data.SystemType.ListOfItems = await this.getSystemTypesByClientId(_clientId);
    step2Data.BuildingItemTypeCodes = await this.getUniformatsByClientId(_clientId, isDFM);
    step2Data.IsDFM = await this.IsDFM(BuildingId) ? "Y" : "N";
    step2Data.VALDATA = new Step2ValidationData();
    step2Data.VALDATA.IsDFM = isDFM ? "Y" : "N";
    return step2Data;
  }

  async getStep4EquipmentProcurementtData(BuildingId: string): Promise<Step4WarrantyData> {
    const step4Data: Step4WarrantyData = new Step4WarrantyData();
    const _clientId = await this.getClientIdByBuildingId((BuildingId))
    step4Data.Ownership = new SmartInput();
    step4Data.Ownership.ListOfItems = await this.getLookUpByLookupType(_clientId, LookupType.Ownsership);
    step4Data.AcquisitionStatus = new SmartInput();
    step4Data.AcquisitionStatus.ListOfItems = await this.getLookUpByLookupType(_clientId, LookupType.AcquisitionStatus);
    step4Data.DispositionStatus = new SmartInput();
    step4Data.DispositionStatus.ListOfItems = await this.getLookUpByLookupType(_clientId, LookupType.DispositionStatus);
    // step4Data.VALDATA = new Step4ValidationData(); 
    // step4Data.VALDATA.StartDate = "";
    // step4Data.VALDATA.KeyDate = "";
    // step4Data.VALDATA.isMaintenanceResponsibility = false;
    // step4Data.VALDATA.WarrantyVenderName = "";
    // step4Data.VALDATA.InstallationDate = "";
    // step4Data.VALDATA.PartsWarrantyDate = "";
    // step4Data.VALDATA.LabourWarrantyDate = "";
    // step4Data.VALDATA.PurchaseDate = "";
    // step4Data.VALDATA.PurchasePrice = "";
    // step4Data.VALDATA.ResponsibilityValue = "";
    // step4Data.VALDATA.ResponsibilityKey ="";
    // step4Data.VALDATA.PMResponsibilityComment="";

    return step4Data;
  }
}

export enum LookupType {
  Ownsership, DispositionStatus, AcquisitionStatus
} 
